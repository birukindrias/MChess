import { Link } from "react-router-dom";
import styles from "./assets/css/Home.module.css";
import ChessLogo from "./assets/images/logo-chess.png";
import BlitzIcon from "./assets/images/blitz.png";
import HomeIcon from "./assets/images/home.png";

export default function HomeNav() {
  return (
    <nav className={styles.right_nav}>
      <h1 className={styles.header}>Play Chess</h1>
      <img src={ChessLogo} alt="Chess Logo" />
      <div className={styles.links}>
        <Link to="/">
          <img src={BlitzIcon} alt="" />
          <h3>Play a Friend Online</h3>
        </Link>
        <Link to="/game">
          <img src={HomeIcon} alt="" />
          <h3>Play Offline</h3>
        </Link>
      </div>
    </nav>
  );
}
