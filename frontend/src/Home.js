import { getOrgBoardProps } from "./Game";
import Board from "./Board";
import RightNav from "./RightNav";

export default function Home() {
  return (
    <>
      <Board boardProps={getOrgBoardProps(false)} />
      <RightNav />
    </>
  );
}
