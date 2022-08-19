from sqlalchemy import (JSON, Boolean, Column, DateTime, ForeignKey, Integer,
                        String)

from .db import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    white_player = Column(Integer, ForeignKey("users.id"))
    black_player = Column(Integer, ForeignKey("users.id"))
    game_moves = Column(JSON)
    time = Column(Integer)
    increment = Column(Integer)


class LiveGame(Base):
    __tablename__ = "livegame"

    id = Column(Integer, primary_key=True)
    white_player = Column(String, ForeignKey("users.username"))
    black_player = Column(String, ForeignKey("users.username"))
    board_props = Column(JSON)
    time = Column(Integer)
    increment = Column(Integer)
    game_end = Column(Boolean)
    game_moves = Column(JSON)
    white_target_time = Column(DateTime)
    black_target_time = Column(DateTime)

    def __repr__(self) -> str:
        return f"LiveGame(id={self.id}, white_player={self.white_player}, black_player={self.black_player}, board_props={self.board_props}, time={self.time}, increment={self.increment})"


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
