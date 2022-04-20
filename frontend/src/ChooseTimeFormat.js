import React, { useState, useEffect, useCallback } from "react";
import { getOrgBoardProps } from "./Game";
import Board from "./Board";
import styles from "./assets/css/TfChooser.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

async function createGame(navigate, timeFormat) {
  const body = {
    initialTime: timeFormat.split(":")[0],
    increment: timeFormat.split(":")[1],
  };
  const response = await fetch("/create_game", {
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });
}

export default function ChooseTimeFormat() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 995);
  const [sp, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkSize = useCallback(
    () => setIsMobile(window.innerWidth <= 995),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", checkSize);

    return () => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  return (
    <div className={styles.container}>
      {isMobile ? null : <Board boardProps={getOrgBoardProps(false)} />}
      <div className={styles.right_box}>
        <h2>Choose the time format</h2>
        <div className={styles.time_format}>
          {sp.get("type") === "offline" ? (
            <>
              <Link to={`/game?tf=3|0`}>3 | 0</Link>
              <Link to="/game?tf=3|2">3 | 2</Link>
              <Link to="/game?tf=5|0">5 | 0</Link>
              <Link to="/game?tf=10|0">10 | 0</Link>
              <Link to="/game?tf=10|5">10 | 5</Link>
              <Link to="/game?tf=15|0">15 | 0</Link>
              <Link to="/game?tf=15|10">15 | 10</Link>
              <Link to="/game?tf=30|0">30 | 0</Link>
              <Link to="/game?tf=30|20">30 | 20</Link>
            </>
          ) : (
            <>
              <button onClick={() => createGame(navigate, "3|0")}>3 | 0</button>
              <button>3 | 2</button>
              <button>5 | 0</button>
              <button>10 | 0</button>
              <button>10 | 5</button>
              <button>15 | 0</button>
              <button>15 | 10</button>
              <button>30 | 0</button>
              <button>30 | 20</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
