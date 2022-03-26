import React, { useState, useEffect } from "react";
import { getOrgBoardProps } from "./Game";
import Board from "./Board";
import styles from "./assets/css/TfChooser.module.css";
import { Link, useSearchParams } from "react-router-dom";

function getLink(timeFormat, type) {
  if (type === "offline") {
    return `/game?tf=${timeFormat}`;
  } else {
    return "/";
  }
}

export default function ChooseTimeFormat() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 995);
  const [sp, setSearchParams] = useSearchParams();

  useEffect(() => {
    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth <= 995)
    );
  }, []);

  return (
    <div className={styles.container}>
      {isMobile ? null : <Board boardProps={getOrgBoardProps(false)} />}
      <div className={styles.right_box}>
        <h2>Choose the time format</h2>
        <div className={styles.time_format}>
          <Link to={getLink("3|0", sp.get("type"))}>3 | 0</Link>
          <Link to={getLink("3|2", sp.get("type"))}>3 | 2</Link>
          <Link to={getLink("5|0", sp.get("type"))}>5 | 0</Link>
          <Link to={getLink("10|0", sp.get("type"))}>10 | 0</Link>
          <Link to={getLink("10|5", sp.get("type"))}>10 | 5</Link>
          <Link to={getLink("15|0", sp.get("type"))}>15 | 0</Link>
          <Link to={getLink("15|10", sp.get("type"))}>15 | 10</Link>
          <Link to={getLink("30|0", sp.get("type"))}>30 | 0</Link>
          <Link to={getLink("30|20", sp.get("type"))}>30 | 20</Link>
        </div>
      </div>
    </div>
  );
}
