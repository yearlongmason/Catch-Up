from fastapi import FastAPI
# To run this api: Open a terminal and navigate to the api folder
# Then run "uvicorn catchupAPI:app --reload"
# Might have to run "pip install uvicorn" or "pip install fastapi" if not already installed
# Great tutorial for using fastapi: https://www.youtube.com/watch?v=tLKKmouUams

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

@app.get("/")
async def testAPIMessage():
    return {"Catch Up":"Cool app!"}

# We can also have a path url such by changing to @app.get("/servers/{serverID}")
@app.get("/servers")
async def getServers(serverID: str=None):
    # If the user specefies a parameter, return only that server
    if serverID:
        return testData[serverID]
    # Otherwise return all servers!
    return testData