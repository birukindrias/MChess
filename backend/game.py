from typing import Dict, List

from fastapi import WebSocket
from sqlalchemy.orm import Session

from backend import crud, models, schemas

from .models import User

org_board: List[Dict] = [
    {"color": "white", "pieceType": "R"},
    {"color": "white", "pieceType": "H"},
    {"color": "white", "pieceType": "B"},
    {"color": "white", "pieceType": "K"},
    {"color": "white", "pieceType": "Q"},
    {"color": "white", "pieceType": "B"},
    {"color": "white", "pieceType": "H"},
    {"color": "white", "pieceType": "R"},
    {"color": "white", "pieceType": "p"},
    {"color": "white", "pieceType": "p"},
    {"color": "white", "pieceType": "p"},
    {"color": "white", "pieceType": "p"},
    {"color": "white", "pieceType": "p"},
    {"color": "white", "pieceType": "p"},
    {"color": "white", "pieceType": "p"},
    {"color": "white", "pieceType": "p"},
]
org_board.extend([""] * 32)
org_board.extend(
    [
        {"color": "black", "pieceType": "p"},
        {"color": "black", "pieceType": "p"},
        {"color": "black", "pieceType": "p"},
        {"color": "black", "pieceType": "p"},
        {"color": "black", "pieceType": "p"},
        {"color": "black", "pieceType": "p"},
        {"color": "black", "pieceType": "p"},
        {"color": "black", "pieceType": "p"},
        {"color": "black", "pieceType": "R"},
        {"color": "black", "pieceType": "H"},
        {"color": "black", "pieceType": "B"},
        {"color": "black", "pieceType": "K"},
        {"color": "black", "pieceType": "Q"},
        {"color": "black", "pieceType": "B"},
        {"color": "black", "pieceType": "H"},
        {"color": "black", "pieceType": "R"},
    ]
)

org_board_props = {
    "board": org_board,
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
        self.db = db
        self.game: models.LiveGame = (
            db.query(models.LiveGame).filter_by(id=self.game_id).first()
        )
        self.game_started = self.game.game_started

    async def add_player(self, username: str, type: str, websocket: WebSocket):
        data = {"user": username, "websocket": websocket}
        self.game_members.append(data)
        if type == "white":
            self.game.white_player = username
        elif type == "black":
            self.game.black_player = username
        print(f"Adding {username} to game {self.game_id}")
        print(f"Game has started?: {self.game_started}")
        self.db.add(self.game)
        self.db.commit()
        self.db.refresh(self.game)

    async def send_command(self, websocket: WebSocket, action: str, **kwargs):
        sent_json = {"type": "command", "action": action}
        sent_json.update(kwargs)
        await websocket.send_json(sent_json)

    async def send_start_command(self, websocket: WebSocket, game: Dict, boardProps):
        await self.send_command(
            websocket, "start-game", game=game, boardProps=boardProps
        )

    async def connect(self, user: models.User, websocket: WebSocket):
        if self.game_started:
            if self.game.white_player == user.username:
                await self.add_player(user.username, "white", websocket)
                await self.send_start_command(
                    websocket,
                    schemas.LiveGame.from_orm(self.game).dict(),
                    self.game.board_props,
                )
            elif self.game.black_player == user.username:
                await self.add_player(user.username, "black", websocket)
                await self.send_start_command(
                    websocket,
                    schemas.LiveGame.from_orm(self.game).dict(),
                    self.game.board_props,
                )
            else:
                self.game_watchers.append(websocket)
        else:
            if user.username == self.game.white_player:
                await self.add_player(user.username, "white", websocket)
            elif user.username == self.game.black_player:
                await self.add_player(user.username, "black", websocket)
            else:
                if self.game.white_player:
                    await self.add_player(user.username, "black", websocket)
                elif self.game.black_player:
                    await self.add_player(user.username, "white", websocket)
            if len(self.game_members) == 2:
                self.game.game_started = True
                self.db.add(self.game)
                self.db.commit()
                self.db.refresh(self.game)
                self.game_started = True
                for player in self.game_members:
                    await self.send_start_command(
                        player["websocket"],
                        schemas.LiveGame.from_orm(self.game).dict(),
                        self.game.board_props,
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
        elif data["action"] == "update-boardProps":
            self.game.board_props = data["boardProps"]
            self.db.add(self.game)
            self.db.commit()
            self.db.refresh(self.game)

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
