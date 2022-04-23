import { useEffect, useState, useReducer, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getOrgBoardProps, reducer } from "./Game";
import GameInfo from "./GameInfo";
import WaitingArea from "./WaitingArea";
import useAuth from "./useAuth";
import OnlineBoard from "./OnlineBoard";
import { movePiece } from "./Board";

const orgBoard = [
  { color: "white", pieceType: "R" },
  { color: "white", pieceType: "H" },
  { color: "white", pieceType: "B" },
  { color: "white", pieceType: "K" },
  { color: "white", pieceType: "Q" },
  { color: "white", pieceType: "B" },
  { color: "white", pieceType: "H" },
  { color: "white", pieceType: "R" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
]
  .concat(Array(32).fill(""))
  .concat([
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "R" },
    { color: "black", pieceType: "H" },
    { color: "black", pieceType: "B" },
    { color: "black", pieceType: "K" },
    { color: "black", pieceType: "Q" },
    { color: "black", pieceType: "B" },
    { color: "black", pieceType: "H" },
    { color: "black", pieceType: "R" },
  ]);

function getTimeFormat(gameInfo) {
  const time = gameInfo.time;
  const increment = gameInfo.increment;

  return `${time}|${increment}`;
}

function sendMove(fromIndex, toIndex, ws) {
  ws.send(
    JSON.stringify({ type: "command", action: "make-move", fromIndex, toIndex })
  );
}

export default function OnlineGame() {
  const params = useParams();
  const [gameId] = useState(params.gameId);
  const [gameInfo, setGameInfo] = useState({});
  const [board, setBoard] = useState(orgBoard);
  const [boardProps, dispatch] = useReducer(reducer, getOrgBoardProps(true));
  const [isWaiting, setIsWaiting] = useState(true);
  const { user, token } = useAuth();
  const [isWatcher, setIsWatcher] = useState(false);
  const [ws, setWs] = useState(
    new WebSocket(`ws://127.0.0.1:8000/api/game/${gameId}`)
  );

  const makeMove = useCallback(
    (toIndex) => {
      const player_color =
        gameInfo.white === user.username
          ? "white"
          : gameInfo.black === user.username
          ? "black"
          : null;

      if (!isWatcher && boardProps.currentMove === player_color) {
        sendMove(boardProps.movingPiece, toIndex, ws);
        movePiece(
          board,
          setBoard,
          boardProps,
          dispatch,
          boardProps.movingPiece,
          toIndex
        );
      }
    },
    [ws, boardProps]
  );

  useEffect(() => {
    ws.addEventListener("open", (ev) => {
      ws.send(token);
    });
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      switch (data.type) {
        case "command":
          if (data.action === "start-game") {
            setGameInfo({
              white: data.game.white_player,
              black: data.game.black_player,
              time: data.game.time,
              increment: data.game.increment,
              game_end: data.game.game_end,
              game_moves: data.game.game_moves,
            });
            setIsWaiting(false);
          } else if (data.action === "start-watching") {
            setIsWatcher(true);
            setGameInfo({
              white: data.game.white_player,
              black: data.game.black_player,
              time: data.game.time,
              increment: data.game.increment,
              game_end: data.game.game_end,
              game_moves: data.game.game_moves,
            });
            setIsWaiting(false);
          } else if (data.action === "make-move") {
            dispatch({ action: "update-moving-piece", index: data.fromIndex });
            movePiece(
              board,
              setBoard,
              boardProps,
              dispatch,
              data.fromIndex,
              data.toIndex
            );
          }
          break;
        case "error":
          console.log(data.detail);
      }
    };
  }, []);

  return (
    <div className="container">
      <OnlineBoard
        board={board}
        boardProps={boardProps}
        dispatch={dispatch}
        player_color={
          gameInfo.white === user.username
            ? "white"
            : gameInfo.black === user.username
            ? "black"
            : null
        }
        makeMove={makeMove}
      />
      {isWaiting ? (
        <WaitingArea
          setIsWaiting={setIsWaiting}
          gameUrl={`http://localhost:3000${window.location.pathname}`}
        />
      ) : (
        <GameInfo
          white={gameInfo.white}
          black={gameInfo.black}
          currentTurn={boardProps.currentMove}
          timeFormat={getTimeFormat(gameInfo)}
          run={!boardProps.gameEnd}
        />
      )}
    </div>
  );
}
