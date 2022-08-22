from typing import List

from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class LiveGame(BaseModel):
    id: int
    white_player: str
    black_player: str
    time: int
    increment: int
    game_end: bool
    game_moves: str

    class Config:
        orm_mode = True


class GameCreate(BaseModel):
    time: int
    increment: int

    class Config:
        orm_mode = True
