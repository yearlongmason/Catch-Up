import os
from datetime import date
import requests
import dotenv
import random

dotenv.load_dotenv()

api_key = os.getenv('API_KEY')
header = {"Authorization": f'Api-Key {api_key}'}

# main is mostly just for testing stuff this file is not meant to be run
def main():
    #get_quote_id("1291817041052827649")
    #get_quote_id("123")

    print(get_random_quote("1291817041052827649"))
    #get_random_quote("123")

def insert_quote(quote: str, server_id: str, author: str): 
    quote_id = get_quote_id(server_id)
    api_url = os.getenv('QUOTE_API_URL')

    data = {
    "quote_id": quote_id,
    "server_id": str(server_id),
    "quote": str(quote),
    "author": str(author),
    "date_quoted": str(date.today())
    }

    requests.post(api_url, data=data, headers=header)

def get_quote_id(server_id: str):
    api_url = os.getenv('ID_API_URL')
    data = {'server_id': str(server_id)}

    response = requests.get(api_url, data=data, headers=header)
    quote_id = response.json()
    if len(quote_id) == 0:
        return 1
    
    try:
        new_id = quote_id[-1]['quote_id'] + 1
    except KeyError:
        new_id = 0

    return new_id

def get_random_quote(server_id: str):
    api_url = f"{os.getenv('RANDOM_API_URL')}{server_id}/"
    response = requests.get(url=api_url, headers=header)

    if response.status_code != 200:
        print(response)
        print("Something went wrong!!!")

    quotes = response.json()
    quote = quotes[random.randrange(len(quotes))]
    quoteString = quote['quote']
    quoteAuthor = quote['author']
    return f'"{quoteString}" - {quoteAuthor}'

# main is mostly just for testing stuff this file is not meant to be run
if  __name__ == "__main__":
    main() 