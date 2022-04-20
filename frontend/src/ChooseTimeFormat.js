import styles from "./assets/css/TfChooser.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BoxContainer from "./BoxContainer";
import StaticBoard from "./StaticBoard";
import CreateGameButton from "./CreateGameButton";

const timeFormats = [
  "3|0",
  "3|2",
  "5|0",
  "10|0",
  "10|5",
  "15|0",
  "15|10",
  "30|0",
  "30|20",
];

export default function ChooseTimeFormat() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  return (
    <StaticBoard>
      <BoxContainer>
        <h2>Choose the time format</h2>
        <div className={styles.time_format}>
          {sp.get("type") === "offline"
            ? timeFormats.map((timeFormat, index) => (
                <Link key={index} to={`/game?tf=${timeFormat}`}>
                  {timeFormat.split("|").join(" + ")}
                </Link>
              ))
            : timeFormats.map((timeFormat, index) => (
                <CreateGameButton key={index} timeFormat={timeFormat} />
              ))}
        </div>
      </BoxContainer>
    </StaticBoard>
  );
}
