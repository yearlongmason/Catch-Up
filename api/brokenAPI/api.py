from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from datetime import date

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

class QuoteBase(BaseModel):
    server_id: str
    quote: str
    author: str
    todaysDate: date # Datetime object

def getDB():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(getDB)]

@app.post("/quotes/", status_code=status.HTTP_201_CREATED)
async def addQuote(quote: QuoteBase, db: db_dependency):
    db_quote = models.Quote(**quote.model_dump())
    db.add(db_quote)
    db.commit()