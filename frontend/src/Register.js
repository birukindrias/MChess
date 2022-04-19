import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./assets/css/Register.module.css";
import ErrorImage from "./assets/images/error.png";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorState, setErrorState] = useState("");
  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !username) {
      setErrorState("Please fill out all required fields");
    } else {
      if (errorState) {
        setErrorState("");
      }
      const user = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        username: username,
      };
      const response = await fetch("/api/users", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        navigate("/");
      } else {
        const errorMsg = await response.json();
        setErrorState(errorMsg.detail);
      }
    }
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1>Register</h1>
      {errorState ? (
        <div className={styles.errorContainer}>
          <img src={ErrorImage} alt="" /> <p>{errorState}</p>
        </div>
      ) : null}
      <input
        type="text"
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
        value={firstName}
      />
      <input
        type="text"
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
        value={lastName}
      />
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <input type="submit" value="Register" />
    </form>
  );
}
