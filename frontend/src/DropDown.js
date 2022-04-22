import { useEffect, useState } from "react";
import styles from "./assets/css/DropDown.module.css";
import { ReactComponent as ProfileIcon } from "./assets/images/profile.svg";
import { ReactComponent as LogoutIcon } from "./assets/images/logout.svg";
import { Link } from "react-router-dom";

function DropDownLink({ to, children, setShow }) {
  return (
    <Link
      to={to}
      className={styles.dropdownItem}
      onClick={() => setShow((show) => !show)}
    >
      {children}
    </Link>
  );
}

function checkIsInDropdown(element) {
  const dropdownClasses = [
    styles.container,
    styles.title,
    styles.titleHover,
    styles.dropdownContainer,
    styles.dropdownItem,
  ];
  let found = false;

  for (const classname of dropdownClasses) {
    if (element.classList.contains(classname)) {
      found = true;
      break;
    }
  }

  return found;
}

export default function DropDown({ title }) {
  const [showDropdown, setShow] = useState(false);

  useEffect(() => {
    function toggleDropDown(e) {
      if (!checkIsInDropdown(e.target)) {
        setShow(false);
      }
    }
    window.addEventListener("click", toggleDropDown);

    return () => window.removeEventListener("click", toggleDropDown);
  }, []);

  return (
    <div className={styles.container}>
      <button
        className={`${styles.title} ${!showDropdown && styles.titleHover}`}
        onClick={() => setShow((show) => !show)}
      >
        {title}
      </button>
      {showDropdown && (
        <div className={styles.dropdownContainer}>
          <DropDownLink to="/profile" setShow={setShow}>
            <ProfileIcon />
            <h4>Profile</h4>
          </DropDownLink>
          <DropDownLink to="/logout" setShow={setShow}>
            <LogoutIcon />
            <h4>Logout</h4>
          </DropDownLink>
        </div>
      )}
    </div>
  );
}
