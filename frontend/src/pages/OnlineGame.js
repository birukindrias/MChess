import { useEffect, useState, useReducer, useCallback } from "react";
import { useParams } from "react-router-dom";
import GameInfo from "../components/GameInfo";
import WaitingArea from "../components/WaitingArea";
import useAuth from "../hooks/useAuth";
import OnlineBoard from "../components/OnlineBoard";
import { movePiece } from "../helpers/gameUtils";
import {
  getMoves,
  checkCastlingRights,
  getOrgBoardProps,
} from "../helpers/utils";

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

function reducer(boardProps, action) {
  switch (action.action) {
    case "show-moves":
      if (boardProps.board[action.index].color !== boardProps.currentMove) {
        return boardProps;
      }
      const indexes = getMoves(boardProps, action.index);
      if (boardProps.movingPiece === action.index) {
        return {
          ...boardProps,
          isMoving: false,
          movableSquares: [],
          movingPiece: null,
        };
      }
      return {
        ...boardProps,
        isMoving: true,
        movableSquares: indexes,
        movingPiece: action.index,
      };
    case "end-game":
      return {
        ...boardProps,
        gameEnd: true,
      };
    case "in-check":
      let returnObj = { ...boardProps };
      returnObj[`${action.kingColor}InCheck`] = true;
      return returnObj;
    case "move-piece":
      return {
        ...checkCastlingRights(
          action.movingPiece,
          action.board[action.movingPiece].pieceType,
          boardProps
        ),
        isMoving: false,
        currentMove: boardProps.currentMove === "white" ? "black" : "white",
        whiteInCheck: false,
        blackInCheck: false,
        movingPiece: null,
        movableSquares: [],
        board: action.board,
      };
    case "update-moving-piece":
      return {
        ...boardProps,
        movingPiece: action.index,
      };
  }
}

export default function OnlineGame() {
  const params = useParams();
  const [gameId] = useState(params.gameId);
  const [gameInfo, setGameInfo] = useState({});
  const [boardProps, dispatch] = useReducer(reducer, getOrgBoardProps(true));
  const [isWaiting, setIsWaiting] = useState(true);
  const { user, token } = useAuth();
  const [isWatcher, setIsWatcher] = useState(false);
  const [ws] = useState(
    new WebSocket(`ws://${process.env.REACT_APP_SERVER_IP}/api/game/${gameId}/`)
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
        movePiece(boardProps, dispatch, boardProps.movingPiece, toIndex);
      }
    },
    [ws, boardProps]
  );

  useEffect(() => {
    ws.addEventListener("open", () => {
      ws.send(token);
    });
    return () => ws.close();
  }, []);

  useEffect(() => {
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
            movePiece(boardProps, dispatch, data.fromIndex, data.toIndex);
          }
          break;
        case "error":
          console.log(data.detail);
          break;
      }
    };
  }, [boardProps, ws]);

  return (
    <div className="container">
      <OnlineBoard
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
          gameUrl={`http://${process.env.REACT_APP_SERVER_IP}${window.location.pathname}`}
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
