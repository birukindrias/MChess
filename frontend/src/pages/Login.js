import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css/Login.module.css";
import ErrorImage from "../assets/images/error.png";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAuth();

  async function handleSumbit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("username", userName);
    data.append("password", password);
    const response = await fetch("/api/token/", {
      method: "POST",
      body: data,
    });
    const responseJson = await response.json();
    if (!response.ok) {
      setErrorMsg(responseJson.detail);
    } else {
      setErrorMsg("");
      localStorage.setItem("chessUserToken", responseJson.access_token);
      setToken(responseJson.access_token);
      navigate("/");
    }
  }

  return (
    <form className={styles.container} onSubmit={handleSumbit}>
      <h1>Login</h1>
      {errorMsg && (
        <div className={styles.errorContainer}>
          <img src={ErrorImage} alt="" /> <p>{errorMsg}</p>
        </div>
      )}
      <input
        type="text"
        name="username"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        autoFocus
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input type="submit" value="Login" />
    </form>
  );
}
