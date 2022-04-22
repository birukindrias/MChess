import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

function formatTimeFormat(timeFormat) {
  return timeFormat.split("|").join(" + ");
}

export default function CreateGameButton({ timeFormat }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  async function handleClick(e) {
    const tf = timeFormat.split("|");
    const data = {
      time: parseInt(tf[0]),
      increment: parseInt(tf[1]),
    };
    const response = await fetch("/api/create_game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      navigate("/");
    }
    const game = await response.json();
    navigate(`/game/${game.id}`);
  }
  return <button onClick={handleClick}>{formatTimeFormat(timeFormat)}</button>;
}
