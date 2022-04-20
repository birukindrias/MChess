import { Link } from "react-router-dom";
import styles from "./assets/css/NavBar.module.css";
import SearchIcon from "./assets/images/search.png";
import DropDown from "./DropDown";
import useAuth from "./useAuth";

function objIsEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default function NavBar() {
  const { user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <h1 className={styles.appName}>MChess</h1>
      </Link>
      <div className={styles.right_nav}>
        <img src={SearchIcon} alt="Search" />
        {!objIsEmpty(user) ? (
          <DropDown title={user.username}></DropDown>
        ) : (
          <Link className={styles.login} to="/login">
            <p>Login</p>
          </Link>
        )}
      </div>
    </nav>
  );
}
