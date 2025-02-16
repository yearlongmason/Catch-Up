import dotenv
import os
import mysql.connector
from datetime import date
import requests

dotenv.load_dotenv()

db = mysql.connector.connect(
    host=os.getenv('MYSQL_HOST'),
    user=os.getenv('MYSQL_USER'),
    password=os.getenv('MYSQL_PASS'),
    database=os.getenv('MYSQL_DB')
    )

cursor = db.cursor(buffered=True)

# main is mostly just for testing stuff this file is not meant to be run
def main():
    #print(os.getenv('MYSQL_DB'))
    get_quote_id()


def insert_quote(quote: str, server_id: str, author: str):
    quote_id = get_quote_id()
    api_url = host=os.getenv('API_URL')

    
    quote = {
    "quote_id": quote_id,
    "server_id": str(server_id),
    "quote": str(quote),
    "author": str(author),
    "date_quoted": str(date.today())
    }

    response = requests.post(api_url, json=quote)
    print(response.json())
    #cursor.execute(f'INSERT INTO app_quotes (quote_id, server_id, quote, author, date_quoted) VALUES ({quote_id}, "{server_id}", "{quote}", "{author}", "{date.today()}");')
    #db.commit()



def get_quote_id():
    cursor.execute(f'SELECT quote_id FROM app_quotes WHERE quote_id = (SELECT MAX(quote_id) FROM app_quotes)')
    db.commit()
    quote_id = cursor.fetchone()
    #print(quote_id[0])
    return quote_id[0] + 1 if quote_id else 1

# main is mostly just for testing stuff this file is not meant to be run
if  __name__ == "__main__":
    main() 