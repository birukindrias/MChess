import { getOrgBoardProps } from "./Game";
import Board from "./Board";
import HomeNav from "./HomeNav";
import { useEffect, useState } from "react";
import styles from "./assets/css/Home.module.css";

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 995);

  useEffect(() => {
    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth <= 995)
    );
  });

  return (
    <div className={styles.container}>
      {isMobile ? null : <Board boardProps={getOrgBoardProps(false)} />}
      <HomeNav />
    </div>
  );
}
