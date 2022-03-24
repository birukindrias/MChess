import Board from "./Board";
import GameInfo from "./GameInfo";
import { useReducer } from "react";
import { getMoves, checkCastlingRights } from "./utils";

const orgBoardProps = {
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
  gameEnd: false,
};

function reducer(boardProps, action) {
  switch (action.action) {
    case "show-moves":
      if (
        action.board[action.index].color !== boardProps.currentMove ||
        boardProps.gameEnd
      ) {
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
  }
}

export default function Game() {
  const [boardProps, dispatch] = useReducer(reducer, orgBoardProps);

  return (
    <>
      <Board boardProps={boardProps} dispatch={dispatch} />
      <GameInfo
        white="jaminux"
        black="kebede"
        currentTurn={boardProps.currentMove}
        timeFormat="10:00"
        run={true}
      />
    </>
  );
}
