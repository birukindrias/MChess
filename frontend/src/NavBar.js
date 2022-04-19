import { Link } from "react-router-dom";
import styles from "./assets/css/NavBar.module.css";
import SearchIcon from "./assets/images/search.png";
import useAuth from "./useAuth";

function objIsEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default function NavBar() {
  const { user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <h1>MChess</h1>
      </Link>
      <div className={styles.right_nav}>
        <img src={SearchIcon} alt="Search" />
        {!objIsEmpty(user) ? (
          <Link to="/profile">
            <h3>{user.username}</h3>
          </Link>
        ) : (
          <Link to="/login">
            <h3>Login</h3>
          </Link>
        )}
      </div>
    </nav>
  );
}
