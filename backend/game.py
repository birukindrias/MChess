from uuid import uuid4

from fastapi.param_functions import Depends
from pydantic import BaseModel

from . import app
from .auth import oauth2_scheme


class Game(BaseModel):
    time: int
    increment: int


@app.post("/create_game/")
async def create_game(game: Game, token: str = Depends(oauth2_scheme)):
    game_id = str(uuid4()).split("-")[0]
    return game_id


@app.get("/learn")
async def learn(token: str = Depends(oauth2_scheme)):
    return {"token": token}


@app.get("/test")
async def test():
    return {"hello": "mike"}
