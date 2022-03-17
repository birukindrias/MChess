from typing import List

from fastapi import FastAPI, WebSocket
from starlette.websockets import WebSocketDisconnect

app = FastAPI()


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_move(self, move: str, websocket: WebSocket):
        await websocket.send_text(move)

    async def broadcast(self, move: str):
        for connection in self.active_connections:
            await connection.send_text(move)


manager = ConnectionManager()


@app.websocket("/game/{game_id}")
async def game_endpoint(websocket: WebSocket, game_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_move(data, websocket)
            await manager.broadcast(f"Client id #{game_id} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{game_id} left the game")
