import BoxContainer from "./BoxContainer";
import InviteLogo from "./assets/images/link.png";
import FireIcon from "./assets/images/new-game.png";
import styles from "./assets/css/WaitingArea.module.css";

function handleOnClick(e) {
  const text = e.target.value;
  navigator.clipboard.writeText(text);

  // TODO: Change this to a small popup
  alert("Copied to clipboard");
}

export default function WaitingArea({ gameUrl }) {
  return (
    <BoxContainer>
      <h2 className={styles.header}>
        Waiting for a player
        <br /> to join the game
      </h2>
      <div className={styles.container}>
        <img src={InviteLogo} alt="" />
        <input
          onClick={handleOnClick}
          contentEditable={false}
          type="text"
          value={gameUrl}
          readOnly={true}
        />
      </div>
      <div className={styles.container}>
        <img src={FireIcon} alt="" />
        <h2>Get Ready for your match</h2>
      </div>
    </BoxContainer>
  );
}
