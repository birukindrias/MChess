import { useState, useEffect } from "react";
import useInterval from "./useInterval";

function decrement(curTime) {
  let [m, s] = curTime.split(":");
  m = parseInt(m);
  s = parseInt(s);

  if (s == 0) {
    if (m == 0) {
      return "done";
    }
    s = 59;
    m--;
  } else {
    s--;
  }
  return convertToString(m, s);
}

function convertToString(minute, second) {
  let textMinute = String(minute);
  let textSecond = String(second);
  if (textMinute.length == 1) {
    textMinute = "0" + textMinute;
  }
  if (textSecond.length == 1) {
    textSecond = "0" + textSecond;
  }
  return textMinute + ":" + textSecond;
}

export default function GameInfo(props) {
  const [currentTurn, setTurn] = useState(props.currentTurn);
  const [whiteTime, setWhiteTime] = useState(props.timeFormat);
  const [blackTime, setBlackTime] = useState(props.timeFormat);
  let curInterval = null;

  useEffect(() => {
    if (currentTurn !== props.currentTurn) {
      setTurn(props.currentTurn);
      console.log(curInterval);
      clearInterval(curInterval);
    }
  }, [props.currentTurn]);

  useInterval(() => {
    if (!props.run) return;
    if (currentTurn === "white") {
      setWhiteTime((whiteTime) => decrement(whiteTime));
    } else if (currentTurn === "black") {
      setBlackTime((blackTime) => decrement(blackTime));
    }
  }, 1000);

  return (
    <div className="game-info">
      <div className="username-timer">
        <h3>{props.white}</h3>
        <h1>{whiteTime}</h1>
      </div>
      <div className="username-timer">
        <h3>{props.black}</h3>
        <h1>{blackTime}</h1>
      </div>
    </div>
  );
}
