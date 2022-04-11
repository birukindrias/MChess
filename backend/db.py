from sqlalchemy.orm import declarative_base
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Boolean, Integer, String

Base = declarative_base()


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    game_id = Column(String, unique=True)
    annoymous = Column(Boolean)
    white_player = Column(Integer, ForeignKey("users.id"))
    black_player = Column(Integer, ForeignKey("users.id"))
    in_progress = Column(Boolean)
    game_position = Column(String)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
