import Board from "../components/Board";
import GameInfo from "../components/GameInfo";
import { useReducer } from "react";
import {
  getMoves,
  checkCastlingRights,
  getOrgBoardProps,
} from "../helpers/utils";
import { useSearchParams } from "react-router-dom";

export function reducer(boardProps, action) {
  switch (action.action) {
    case "show-moves":
      if (boardProps.board[action.index].color !== boardProps.currentMove) {
        return boardProps;
      }
      const indexes = getMoves(boardProps, action.index);
      if (boardProps.movingPiece === action.index) {
        return {
          ...boardProps,
          isMoving: false,
          movableSquares: [],
          movingPiece: null,
        };
      }
      return {
        ...boardProps,
        isMoving: true,
        movableSquares: indexes,
        movingPiece: action.index,
      };
    case "end-game":
      return {
        ...boardProps,
        gameEnd: true,
      };
    case "in-check":
      let returnObj = { ...boardProps };
      returnObj[`${action.kingColor}InCheck`] = true;
      return returnObj;
    case "move-piece":
      return {
        ...checkCastlingRights(
          action.movingPiece,
          action.board[action.movingPiece].pieceType,
          boardProps
        ),
        isMoving: false,
        currentMove: boardProps.currentMove === "white" ? "black" : "white",
        whiteInCheck: false,
        blackInCheck: false,
        movingPiece: null,
        movableSquares: [],
        board: action.board,
      };
  }
}

export default function Game(props) {
  const [boardProps, dispatch] = useReducer(
    reducer,
    getOrgBoardProps(props.running)
  );
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <Board boardProps={boardProps} dispatch={dispatch} />
      <GameInfo
        white="White"
        black="Black"
        currentTurn={boardProps.currentMove}
        timeFormat={searchParams.get("tf")}
        run={!boardProps.gameEnd}
      />
    </div>
  );
}
