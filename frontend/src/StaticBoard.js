import { useState, useCallback, useEffect } from "react";
import styles from "./assets/css/StaticBoard.module.css";
import { getOrgBoardProps } from "./Game";
import Board from "./Board";

export default function StaticBoard({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 995);

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
      {!isMobile && <Board boardProps={getOrgBoardProps(false)} />}
      {children}
    </div>
  );
}
