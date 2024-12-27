import dotenv
import os
import mysql.connector
from datetime import date

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="2ndACR9!1",
    database="catchupdb"
    )

cursor = db.cursor()

def main():
    print(os.getenv('MYSQL_PASS'))
    #os.getenv('MYSQL_USER')
    #os.getenv('MYSQL_PASS')
    #db = mysql.connector.connect(
    #host="localhost",
    #user="root",
    #password="2ndACR9!1",
    #database="catchupdb"
    #)
    #print(db)
    #cursor = db.cursor()
    #cursor.execute('INSERT INTO quotes (server_id, quote, author, date_quoted) VALUES ("1234567891011121314", "Dont you dare start crying!", "Frank Canovatchel", "2024-12-14");')
    #db.commit()

def insert_quote(quote: str, server_id: str, author: str):
    print(quote)
    cursor.execute(f'INSERT INTO quotes (server_id, quote, author, date_quoted) VALUES ("{server_id}", "{quote}", "{author}", "{date.today()}");')
    print(cursor.fetchall())
    db.commit()

if  __name__ == "__main__":
    main() 