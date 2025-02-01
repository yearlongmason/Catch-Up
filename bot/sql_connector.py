import dotenv
import os
import mysql.connector
from datetime import date

dotenv.load_dotenv()

db = mysql.connector.connect(
    host=os.getenv('MYSQL_HOST'),
    user=os.getenv('MYSQL_USER'),
    password=os.getenv('MYSQL_PASS'),
    database=os.getenv('MYSQL_DB')
    )

cursor = db.cursor()

# main is mostly just for testing stuff this file is not meant to be run
def main():
    print(os.getenv('MYSQL_DB'))


def insert_quote(quote: str, server_id: str, author: str):
    cursor.execute(f'INSERT INTO app_quotes (server_id, quote, author, date_quoted) VALUES ("{server_id}", "{quote}", "{author}", "{date.today()}");')
    db.commit()

# main is mostly just for testing stuff this file is not meant to be run
if  __name__ == "__main__":
    main() 