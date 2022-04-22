import React, { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BoxContainer from "./BoxContainer";
import StaticBoard from "./StaticBoard";
import styles from "./assets/css/CreateOnlineGame.module.css";
import InviteLinkIcon from "./assets/images/link.png";
import NewGameIcon from "./assets/images/new-game.png";
import ChessLogo from "./assets/images/logo-chess.png";
import useAuth from "./useAuth";

export default function CreateOnlineGame() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("Login to play an online game");
      navigate("/login");
    }
  }, []);
  return (
    <StaticBoard>
      <BoxContainer>
        <h2 className={styles.header}>Play your friends online</h2>
        <img src={ChessLogo} alt="Chess Logo" className={styles.titleImg} />
        <div className={styles.container}>
          <Link to="/tfChoose?type=online">
            <img src={NewGameIcon} alt="" />
            <h3>Create a New Online Game</h3>
          </Link>
          <Link to="/">
            <img src={InviteLinkIcon} alt="" />
            <h3>Invite Link</h3>
          </Link>
        </div>
      </BoxContainer>
    </StaticBoard>
  );
}
