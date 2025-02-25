import os
from datetime import date
import requests
import dotenv

dotenv.load_dotenv()

# main is mostly just for testing stuff this file is not meant to be run
def main():
    get_quote_id("1291817041052827649")
    #get_quote_id("123")


def insert_quote(quote: str, server_id: str, author: str): 
    quote_id = get_quote_id(server_id)
    api_url = host=os.getenv('QUOTE_API_URL')

    
    quote = {
    "quote_id": quote_id,
    "server_id": str(server_id),
    "quote": str(quote),
    "author": str(author),
    "date_quoted": str(date.today())
    }

    requests.post(api_url, json=quote)



def get_quote_id(server_id: str):
    api_url = host=os.getenv('ID_API_URL')
    data = {'server_id': str(server_id)}

    response = requests.get(api_url, json=data)
    quote_id = response.json()
    new_id = quote_id[-1]['quote_id'] + 1

    return new_id

    

# main is mostly just for testing stuff this file is not meant to be run
if  __name__ == "__main__":
    main() 