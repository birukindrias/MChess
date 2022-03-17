import { useState } from "react";
import "./App.css";
import Board from "./Board";
import GameInfo from "./GameInfo";

function App() {
  const [curTurn, setCurTurn] = useState("white");
  const [gameEnd, setGameEnd] = useState(false);
  return (
    <>
      <Board setTurn={setCurTurn} gameEnd={gameEnd} />
      <GameInfo
        white="jaminux"
        black="kebede"
        currentTurn={curTurn}
        timeFormat="10:00"
        run={true}
        gameEnd={setGameEnd}
      />
    </>
  );
}

export default App;
