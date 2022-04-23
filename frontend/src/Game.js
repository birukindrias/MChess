import Board from "./Board";
import GameInfo from "./GameInfo";
import { useReducer } from "react";
import { getMoves, checkCastlingRights } from "./utils";
import { useSearchParams } from "react-router-dom";

export function reducer(boardProps, action) {
  switch (action.action) {
    case "show-moves":
      if (action.board[action.index].color !== boardProps.currentMove) {
        return boardProps;
      }
      const indexes = getMoves(action.board, boardProps, action.index);
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
    case "moved-piece":
      let finalObj = { ...boardProps };
      finalObj.isMoving = false;
      finalObj.currentMove =
        boardProps.currentMove === "white" ? "black" : "white";
      if (finalObj[`${boardProps.currentMove}InCheck`]) {
        finalObj[`${boardProps.currentMove}InCheck`] = false;
      }
      finalObj.isMoving = false;
      finalObj.movingPiece = null;
      finalObj.movableSquares = [];
      checkCastlingRights(
        boardProps.movingPiece,
        action.board[boardProps.movingPiece].pieceType,
        boardProps,
        finalObj
      );
      return finalObj;
    case "update-moving-piece":
      return {
        ...boardProps,
        movingPiece: action.index,
      };
  }
}

export function getOrgBoardProps(running) {
  return {
    currentMove: "white",
    isMoving: false,
    movableSquares: [],
    movingPiece: null,
    canWhiteKingSideCastle: true,
    canWhiteQueenSideCastle: true,
    canBlackKingSideCastle: true,
    canBlackQueenSideCastle: true,
    whiteInCheck: false,
    blackInCheck: false,
    gameEnd: !running,
  };
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
