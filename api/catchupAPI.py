from fastapi import FastAPI
from dotenv import load_dotenv
import os
import mysql.connector
from datetime import date
# To run this api: Open a terminal and navigate to the api folder
# Then run "uvicorn catchupAPI:app --reload"
# Might have to run "pip install uvicorn" or "pip install fastapi" if not already installed
# Great tutorial for using fastapi: https://www.youtube.com/watch?v=tLKKmouUams


#env stuff yo
load_dotenv(".env")

app = FastAPI()

# This isn't actually the format our data will be in, it's just a test
testData = {
    "Dune Server":{
        "Jessica Quotes": ["Fear is the mind killer",],
        "Paul Quotes": ["I recognized your footsteps, old man.",],
        "Stillgar Quotes": ["The Mahdi is too humble to say He is the Mahdi. Even more reason to know He is! As written!"],
        "Leto Quotes": ["A great man doesn't seek to lead; he is called to it.",
                        "Here I am, here I remain."]
    },
    "La La Land Server":{
        "Sebastian Quotes": ["Requesting \"I Ran\" from a serious musician is just too far",
                             "I hear what you're saying, but I don't think you're saying what you mean",
                             "What do you mean you don't like jazz?"],
        "Mia Quotes": ["Can I borrow what you're wearing? Because I have an audition next week. I'm playing a serious firefighter.",
                       "I hate jazz."]
    }
}

db = mysql.connector.connect(
    host=os.getenv('MYSQL_HOST'),
    user=os.getenv('MYSQL_USER'),
    password=os.getenv('MYSQL_PASS'),
    database=os.getenv('MYSQL_DB')
    )

cursor = db.cursor()

@app.get("/")
async def testAPIMessage():
    return {"Catch Up":"Ketchup?"}

# We can also have a path url such by changing to @app.get("/servers/{serverID}")
@app.get("/testServers")
async def testGetServers(serverID: str=None):
    # If the user specefies a parameter, return only that server
    if serverID:
        return testData[serverID]
    # Otherwise return all servers!
    return testData

@app.get("/quotes")
async def getQuotes(serverID: str):
    """Returns all quotes given a specific serverID"""
    # If the serverID is not provided
    if not serverID:
        return {"ERROR":"No Server ID"}
    
    # Get all quotes from the server
    cursor.execute(f'''SELECT * FROM catchupdb.quotes
WHERE catchupdb.quotes.server_id = "{serverID}";''')
    db.commit
    allQuotes = cursor.fetchall()
    print(allQuotes)

    # If the data that was returned is not empty, format it as a list of dictionaries
    for i in range(len(allQuotes)):
        quoteDict = {}
        quoteDict["quoteID"] = allQuotes[i][0]
        quoteDict["serverID"] = allQuotes[i][1]
        quoteDict["quote"] = allQuotes[i][2]
        quoteDict["author"] = allQuotes[i][3]
        quoteDict["date"] = allQuotes[i][4]
        allQuotes[i] = quoteDict

    return allQuotes     #testData[serverID]

@app.get("/servers")
async def getServers():
    """Get all unique serverID's from database"""
    cursor.execute('SELECT DISTINCT(server_id) FROM catchupdb.quotes;')
    db.commit
    allServers = cursor.fetchall()
    # Flatten list so it's formatted as list[string] instead of list[list[string]]
    allServers = [serverID for serverList in allServers for serverID in serverList]
    return allServers

@app.post("/logQuote")
async def logQuote(serverID: str, quote: str, author: str):
    """Add a new quote to the server using a post request"""
    # Make sure the user passed in parameters
    if not serverID:
        return {"ERROR":"No Server ID"}
    if not quote:
        return {"ERROR":"No quote provided"}
    if not author:
        return {"ERROR":"No author provided"}
    
    # Try to add to the database, if it doesn't work, return false
    try:
        cursor.execute(f'''INSERT INTO quotes (server_id, quote, author, date_quoted) 
                    VALUES ("{serverID}", "{quote}", "{author}", "{date.today()}");''')
        db.commit()
    except Exception:
        return "False"

    return "True"