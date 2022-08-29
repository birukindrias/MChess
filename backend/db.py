from dotenv import dotenv_values
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm.session import sessionmaker

config = dotenv_values("backend/.env")

SQLALCHEMY_DATABASE_URL = f"mysql+mysqldb://{config['MYSQL_USER']}:{config['MYSQL_PASSWORD']}@localhost/chess?charset=utf8mb4"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
