import { useState } from "react";
import styles from "./assets/css/Login.module.css";

export default function Login() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSumbit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("username", userName);
    data.append("password", password);
    const response = await fetch("/api/token", {
      method: "POST",
      body: data,
    });
    const responseJson = await response.json();
    console.log(responseJson);
  }

  return (
    <form className={styles.container} onSubmit={handleSumbit}>
      <h1>Login</h1>
      <input
        type="text"
        name="username"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
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
