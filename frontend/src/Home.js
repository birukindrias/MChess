import { getOrgBoardProps } from "./Game";
import Board from "./Board";
import HomeNav from "./HomeNav";
import { useCallback, useEffect, useState } from "react";
import styles from "./assets/css/Home.module.css";

export default function Home() {
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
  }, [checkSize]);

  return (
    <div className={styles.container}>
      {isMobile ? null : <Board boardProps={getOrgBoardProps(false)} />}
      <HomeNav />
    </div>
  );
}
