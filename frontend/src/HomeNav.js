import { Link } from "react-router-dom";
import styles from "./assets/css/Home.module.css";
import ChessLogo from "./assets/images/logo-chess.png";
import BlitzIcon from "./assets/images/blitz.png";
import HomeIcon from "./assets/images/home.png";
import BoxContainer from "./BoxContainer";

export default function HomeNav() {
  return (
    <BoxContainer>
      <h1 className={styles.header}>Play Chess</h1>
      <img src={ChessLogo} alt="Chess Logo" className={styles.titleImg} />
      <div className={styles.links}>
        <Link to="/online">
          <img src={BlitzIcon} alt="" />
          <h3>Play a Friend Online</h3>
        </Link>
        <Link to="/tfChoose?type=offline">
          <img src={HomeIcon} alt="" />
          <h3>Play Offline</h3>
        </Link>
      </div>
    </BoxContainer>
  );
}
