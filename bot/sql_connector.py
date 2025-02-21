import dotenv
import os
from datetime import date
import requests

dotenv.load_dotenv()

# main is mostly just for testing stuff this file is not meant to be run
def main():
    get_quote_id()


def insert_quote(quote: str, server_id: str, author: str):
    quote_id = get_quote_id()
    api_url = host=os.getenv('QUOTE_API_URL')

    
    quote = {
    "quote_id": quote_id,
    "server_id": str(server_id),
    "quote": str(quote),
    "author": str(author),
    "date_quoted": str(date.today())
    }

    response = requests.post(api_url, json=quote)
    print(response.json())



def get_quote_id():
    # TODO: change this so it gets max quote from your server!!!
    api_url = host=os.getenv('ID_API_URL')
    response = requests.get(api_url)
    quote_id = response.json()
    print(quote_id[0])

    

# main is mostly just for testing stuff this file is not meant to be run
if  __name__ == "__main__":
    main() 