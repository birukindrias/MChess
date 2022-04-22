import { useEffect, useState, useReducer } from "react";
import { useParams } from "react-router-dom";
import { getOrgBoardProps, reducer } from "./Game";
import GameInfo from "./GameInfo";
import Board from "./Board";
import WaitingArea from "./WaitingArea";
import useAuth from "./useAuth";

function getTimeFormat(gameInfo) {
  const time = gameInfo.time;
  const increment = gameInfo.increment;

  return `${time}|${increment}`;
}

export default function OnlineGame() {
  const params = useParams();
  const [gameId] = useState(params.gameId);
  const [gameInfo, setGameInfo] = useState({});
  const [boardProps, dispatch] = useReducer(reducer, getOrgBoardProps(true));
  const [isWaiting, setIsWaiting] = useState(true);
  const { token } = useAuth();
  let ws;

  useEffect(() => {
    ws = new WebSocket(`ws://127.0.0.1:8000/api/game/${gameId}`);
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
          }
      }
    };
  }, []);

  return (
    <div className="container">
      <Board boardProps={boardProps} dispatch={dispatch} />
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
