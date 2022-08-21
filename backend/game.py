from typing import Dict, List

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
    def __init__(self, game_id: int, db: Session):
        self.game_members: List[Dict] = []
        self.game_watchers: List[WebSocket] = []
        self.game_id = game_id
        self.game_started = False
        self.game: models.LiveGame = (
            db.query(models.LiveGame).filter_by(id=self.game_id).first()
        )

    def update_db(self, db: Session):
        self.game = db.query(models.LiveGame).filter_by(id=self.game_id).first()

    async def add_player(
        self, username: str, type: str, websocket: WebSocket, db: Session
    ):
        data = {"user": username, "websocket": websocket}
        self.game_members.append(data)
        if type == "white":
            self.game.white_player = username
        elif type == "black":
            self.game.black_player = username
        print(f"Adding {username} to userlist")
        db.add(self.game)
        db.commit()
        db.refresh(self.game)

    async def send_command(self, websocket: WebSocket, action: str, **kwargs):
        sent_json = {"type": "command", "action": action}
        sent_json.update(kwargs)
        await websocket.send_json(sent_json)

    async def connect(self, user: models.User, websocket: WebSocket, db: Session):
        if self.game_started:
            if self.game.white_player == user.username:
                await self.add_player(user.username, "white", websocket, db)
            elif self.game.black_player == user.username:
                await self.add_player(user.username, "black", websocket, db)
            else:
                self.game_watchers.append(websocket)
        else:
            if user.username == self.game.white_player:
                await self.add_player(user.username, "white", websocket, db)
            elif user.username == self.game.black_player:
                await self.add_player(user.username, "black", websocket, db)
            else:
                if self.game.white_player:
                    await self.add_player(user.username, "black", websocket, db)
                elif self.game.black_player:
                    await self.add_player(user.username, "white", websocket, db)
                if len(self.game_members) == 2:
                    self.game_started = True
                    for player in self.game_members:
                        await self.send_command(
                            player["websocket"],
                            "start-game",
                            game=schemas.LiveGame.from_orm(self.game).dict(),
                        )

    async def make_move(self, fromIndex, toIndex):
        for player in self.game_members:
            await self.send_command(
                player["websocket"],
                "make-move",
                fromIndex=fromIndex,
                toIndex=toIndex,
            )
        for watcher in self.game_watchers:
            await self.send_command(watcher, "make-move", fromIndex, toIndex)

    async def handle_command(self, data: dict, websocket: WebSocket):
        if data["action"] == "make-move":
            await self.make_move(data["fromIndex"], data["toIndex"])

    async def send_error(self, websocket: WebSocket, detail: str):
        msg = {"type": "error", "detail": detail}
        await websocket.send_json(msg)
        print("sent error")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.game_watchers:
            self.game_watchers.remove(websocket)
        else:
            for player in self.game_members.copy():
                if player["websocket"] == websocket:
                    self.game_members.remove(player)
                    break
