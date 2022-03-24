import { useState, useEffect, useCallback } from "react";
import useInterval from "./useInterval";

function decrement(curTime) {
  let [m, s] = curTime.split(":");
  m = parseInt(m);
  s = parseInt(s);

  if (s === 0) {
    if (m === 0) {
      return "0:00";
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
  if (textMinute.length === 1) {
    textMinute = "0" + textMinute;
  }
  if (textSecond.length === 1) {
    textSecond = "0" + textSecond;
  }
  return textMinute + ":" + textSecond;
}

let changed = false;
export default function GameInfo(props) {
  const [currentTurn, setTurn] = useState(props.currentTurn);
  const [whiteTime, setWhiteTime] = useState(props.timeFormat);
  const [blackTime, setBlackTime] = useState(props.timeFormat);

  useEffect(() => {
    if (currentTurn !== props.currentTurn) {
      setTurn(props.currentTurn);
      changed = true;
    }
  }, [props.currentTurn]);

  const memoizedCallback = useCallback(() => {
    if (currentTurn === "white") {
      setWhiteTime((whiteTime) => decrement(whiteTime));
    } else if (currentTurn === "black") {
      setBlackTime((blackTime) => decrement(blackTime));
    }
    if (changed) changed = !changed;
  }, [currentTurn]);

  useInterval(memoizedCallback, props.run ? (changed ? 1300 : 1000) : null);

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
