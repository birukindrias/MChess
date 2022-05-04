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
    def __init__(self):
        self.game_members: List[Dict] = []
        self.game_watchers: List[WebSocket] = []
        self.game_full = False
        self.game_id = None
        self.game_started = False
        self.game: models.LiveGame = None

    def set_game_id(self, game_id: int, db: Session):
        self.game_id = game_id
        self.game = db.query(models.LiveGame).filter_by(id=self.game_id).first()

    # async def send_move(self, data: dict, websocket: WebSocket, db: Session):
    #     cur_board = data["board"]
    #     for player in self.game_members:
    #         if player != websocket:
    #             await player.send_json(cur_board)

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

    async def send_command(
        self, websocket: WebSocket, action: str, game: models.LiveGame
    ):
        await websocket.send_json(
            {
                "type": "command",
                "action": action,
                "game": schemas.LiveGame.from_orm(game).dict(),
            }
        )

    async def connect(self, user: models.User, websocket: WebSocket, db: Session):
        if self.game_started and len(self.game_members) == 2:
            self.game_watchers.append(websocket)

        elif self.game_started and len(self.game_members) < 2:
            if user.username == self.game.white_player:
                await self.add_player(user.username, "white", websocket, db)
            elif user.username == self.game.black_player:
                await self.add_player(user.username, "black", websocket, db)
            else:
                self.game_watchers.append(websocket)

        elif len(self.game_members) < 1:
            if user.username == self.game.white_player:
                await self.add_player(user.username, "white", websocket, db)
            elif user.username == self.game.black_player:
                await self.add_player(user.username, "black", websocket, db)
            else:
                await self.send_error(
                    websocket,
                    "You have to wait for the person who created the game to join",
                )

        else:
            if (
                self.game_members[0]["user"] != user.username
                and not self.game.black_player
            ):
                await self.add_player(user.username, "black", websocket, db)
            elif (
                self.game_members[0]["user"] != user.username
                and not self.game.white_player
            ):
                await self.add_player(user.username, "white", websocket, db)
            else:
                await self.send_error(websocket, "You have already joined the game")
            for player in self.game_members:
                await self.send_command(player["websocket"], "start-game", self.game)
            self.game_started = True

    async def make_move(self, fromIndex, toIndex, websocket: WebSocket):
        for player in self.game_members:
            if player["websocket"] != websocket:
                await player["websocket"].send_json(
                    {
                        "type": "command",
                        "action": "make-move",
                        "fromIndex": fromIndex,
                        "toIndex": toIndex,
                    }
                )

    async def handle_command(self, data: dict, websocket: WebSocket):
        if data["action"] == "make-move":
            await self.make_move(data["fromIndex"], data["toIndex"], websocket)

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
