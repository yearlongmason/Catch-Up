from sqlalchemy import Boolean, Column, Integer, String, Date
from database import Base

class Quote(Base):
    __tablename__ = "quotes"

    quote_id = Column(Integer, primary_key=True, autoincrement=True,index=True)
    server_id = Column(String(20))
    quote = Column(String(280))
    author = Column(String(30))
    date_quoted = Column(Date)