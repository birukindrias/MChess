import { Link } from "react-router-dom";
import styles from "./assets/css/NavBar.module.css";
import SearchIcon from "./assets/images/search.png";

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <h1>MChess</h1>
      </Link>
      <div className={styles.right_nav}>
        <img src={SearchIcon} alt="Search" />
        <Link to="/profile">
          <h3>Profile</h3>
        </Link>
      </div>
    </nav>
  );
}
