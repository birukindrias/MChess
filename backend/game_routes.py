from typing import List

from fastapi import Depends, WebSocket
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from starlette import status
from starlette.websockets import WebSocketDisconnect

from backend import schemas

from . import app, crud, models
from .auth import authenticate_access_token, oauth2_scheme
from .db import get_db
from .game import GameManager

manager = GameManager()


@app.post("/api/create_game/")
async def create_game(
    game: schemas.GameCreate,
    user: models.User = Depends(authenticate_access_token),
    db: Session = Depends(get_db),
):
    user_scheme = schemas.User.from_orm(user)
    created_game = await crud.create_game(db, user_scheme, game)
    return created_game


@app.get("/api/game")
async def get_game(game_id: int, db: Session = Depends(get_db)):
    game = await crud.get_live_game(db, game_id)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested game does not exist",
        )
    return game


@app.websocket("/api/game/{game_id}")
async def run_game(game_id: int, websocket: WebSocket, db: Session = Depends(get_db)):
    manager.set_game_id(game_id)
    await websocket.accept()
    verified = False
    while not verified:
        data = await websocket.receive_text()
        user = await authenticate_access_token(data, db)
        if user:
            verified = True
            await manager.add_player(user, db, websocket)
            await manager.connect(websocket, db)
            break
        else:
            websocket.send_text("Invalid credentials")

    if verified:
        try:
            while True:
                data = await websocket.receive_json()
                await manager.send_move(data, websocket, db)
        except WebSocketDisconnect:
            manager.disconnect(websocket)


@app.get("/test")
async def test():
    return {"hello": "mike"}
