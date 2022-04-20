from fastapi import Depends
from sqlalchemy.orm import Session

from backend import schemas

from . import app, crud, models
from .auth import authenticate_access_token, oauth2_scheme
from .db import get_db
from .schemas import Game


@app.post("/api/create_game/")
async def create_game(
    game: Game,
    user: models.User = Depends(authenticate_access_token),
    db: Session = Depends(get_db),
):
    user_scheme = schemas.User.from_orm(user)
    created_game = crud.create_game(db, user_scheme, game)
    return created_game


@app.get("/learn")
async def learn(token: str = Depends(oauth2_scheme)):
    return {"token": token}


@app.get("/test")
async def test():
    return {"hello": "mike"}
