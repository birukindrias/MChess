from typing import List

from fastapi import WebSocket
from sqlalchemy.orm import Session

from backend import crud, models, schemas

from .models import User

org_board_props = {
    "currentMove": "white",
    "isMoving": False,
    "movableSquares": [],
    "movingPiece": None,
    "canWhiteKingSideCastle": True,
    "canWhiteQueenSideCastle": True,
    "canBlackKingSideCastle": True,
    "canBlackQueenSideCastle": True,
    "whiteInCheck": False,
    "blackInCheck": False,
    "gameEnd": False,
}


class GameManager:
    def __init__(self):
        self.game_members: List[WebSocket] = []
        self.game_watchers: List[WebSocket] = []
        self.game_full = False
        self.game_id = None
        self.game_started = False

    def set_game_id(self, game_id: int):
        self.game_id = game_id

    async def send_move(self, data: dict, websocket: WebSocket, db: Session):
        cur_board = data["board"]
        for player in self.game_members:
            if player != websocket:
                await player.send_json(cur_board)

    async def connect(self, websocket: WebSocket, db: Session):
        if self.game_full or len(self.game_members) > 2:
            self.game_watchers.append(websocket)
        else:
            self.game_members.append(websocket)
            self.game_full = len(self.game_members) == 2

        if self.game_full:
            for player in self.game_members:
                game = schemas.LiveGame.from_orm(
                    await crud.get_live_game(db, self.game_id)
                ).dict()
                await player.send_json(
                    {"type": "command", "action": "start-game", "game": game}
                )
            self.game_started = True

    async def update_game(self, data: dict, db):
        pass

    async def send_error(self, websocket: WebSocket, detail: str):
        msg = {"type": "error", "detail": detail}
        websocket.send_json(msg)
        print("sent error")

    async def add_player(self, user: User, db: Session, websocket: WebSocket):
        game = db.query(models.LiveGame).filter_by(id=self.game_id).first()
        if game.white_player == user.username or game.black_player == user.username:
            return
        if not game.white_player and game.black_player:
            game.white_player = user.username
        if not game.black_player and game.white_player:
            game.black_player = user.username
        db.add(game)
        db.commit()

    def disconnect(self, websocket: WebSocket):
        if websocket in self.game_watchers:
            self.game_watchers.remove(websocket)
