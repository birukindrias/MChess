from uuid import uuid4

from pydantic import BaseModel

from . import app


class Game(BaseModel):
    time: int
    increment: int


@app.post("/create_game/")
def create_game(game: Game):
    game_id = str(uuid4()).split("-")[0]
    return game


@app.get("/test")
def test():
    return {"hello": "mike"}
