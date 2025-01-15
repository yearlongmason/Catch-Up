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
    return {"Catch Up":"Cool app!"}

# We can also have a path url such by changing to @app.get("/servers/{serverID}")
@app.get("/testServers")
async def testGetServers(serverID: str=None):
    # If the user specefies a parameter, return only that server
    if serverID:
        return testData[serverID]
    # Otherwise return all servers!
    return testData

@app.get("/quotes")
async def getQuotes(serverID: str=None):
    if not serverID:
        return {"ERROR":"No Server ID"}
    cursor.execute(f'''SELECT quotes.server_id, quotes.quote, quotes.author, quotes.date_quoted FROM servers
                   JOIN quotes ON quotes.server_id = servers.server_id 
                   WHERE servers.server_id={serverID}''')
    db.commit
    allQuotes = cursor.fetchall()

    # If the data that was returned is not empty, format it as a list of dictionaries
    for i in range(len(allQuotes)):
        quoteDict = {}
        quoteDict["quote"] = allQuotes[i][1]
        quoteDict["author"] = allQuotes[i][2]
        quoteDict["date"] = allQuotes[i][3]
        allQuotes[i] = quoteDict

    return allQuotes     #testData[serverID]