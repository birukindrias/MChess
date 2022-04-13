from sqlalchemy import Boolean, Column, ForeignKey, Integer, String

from .db import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    annoymous = Column(Boolean)
    white_player = Column(Integer, ForeignKey("users.id"))
    black_player = Column(Integer, ForeignKey("users.id"))
    in_progress = Column(Boolean)
    game_position = Column(String)
    game_pgn = Column(String)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    password_hash = Column(String)

    def __repr__(self) -> str:
        return f"User(username: {self.username}, first_name: {self.first_name}, last_name: {self.last_name}, email={self.email})"
