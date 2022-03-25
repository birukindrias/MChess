import React, { useState, useEffect } from "react";
import { getOrgBoardProps } from "./Game";
import Board from "./Board";
import styles from "./assets/css/TfChooser.module.css";
import { Link, useSearchParams } from "react-router-dom";

export default function ChooseTimeFormat() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 995);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth <= 995)
    );
  });

  return (
    <div className={styles.container}>
      {isMobile ? null : <Board boardProps={getOrgBoardProps(false)} />}
      <div className={styles.right_box}>
        <h2>Choose the time format</h2>
        <div className={styles.time_format}>
          <Link to={`/game?tf=3|0`}>3 | 0</Link>
          <Link to="/game?tf=3|2">3 | 2</Link>
          <Link to="/game?tf=5|0">5 | 0</Link>
          <Link to="/game?tf=10|0">10 | 0</Link>
          <Link to="/game?tf=10|5">10 | 5</Link>
          <Link to="/game?tf=15|0">15 | 0</Link>
          <Link to="/game?tf=15|10">15 | 10</Link>
          <Link to="/game?tf=30|0">30 | 0</Link>
          <Link to="/game?tf=30|20">30 | 20</Link>
        </div>
      </div>
    </div>
  );
}
