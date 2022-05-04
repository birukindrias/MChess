import Square from "../components/Square";
import { useState } from "react";
import {
  getSquareColor,
  swap,
  inCheck,
  checkCheckmated,
  checkPromotion,
  castledBoard,
  isCastling,
  orgBoard
} from "../helpers/utils";
import moveSound from "../assets/sounds/Move.ogg";
import captureSound from "../assets/sounds/Capture.ogg";

export function setInCheck(board, boardProps, setBoardProps) {
  const curMove = boardProps.currentMove;
  const kingColor = curMove === "white" ? "black" : "white";
  const kingIndex = board.findIndex((curPiece) => {
    if (curPiece.color === kingColor && curPiece.pieceType === "K") {
      return true;
    }
    return false;
  });

  if (inCheck(board, kingColor)) {
    if (checkCheckmated(board, kingColor)) {
      // since normal checking code doesn't run if king has been checkmated;
      const kingPiece = document.querySelectorAll(".square")[kingIndex];
      kingPiece.classList.add("kingCheck");

      setBoardProps({ action: "end-game" });
      return;
    } else {
      setBoardProps({ action: "in-check", kingColor: kingColor });
    }
  }
}

export function movePiece(board, boardProps, dispatch, fromIndex, toIndex) {
  let finalBoard;
  if (isCastling(board, fromIndex, toIndex, boardProps)) {
    moveAudio.play();
    finalBoard = castledBoard(board, fromIndex, toIndex);
    dispatch({
      action: "moved-piece",
      board: finalBoard,
      movingPiece: fromIndex,
    });
    return finalBoard;
  } else if (board[toIndex] === "") {
    moveAudio.play();
    let tmp = [...board];
    if (checkPromotion(board, fromIndex, toIndex)) {
      tmp[fromIndex] = {
        color: board[fromIndex].color,
        pieceType: "Q",
      };
    }
    finalBoard = swap(board, fromIndex, toIndex);
    setInCheck(finalBoard, boardProps, dispatch);
    dispatch({
      action: "moved-piece",
      board: finalBoard,
      movingPiece: fromIndex,
    });
    return finalBoard;
  } else {
    let finalBoard = [...board];
    if (checkPromotion(board, fromIndex, toIndex)) {
      finalBoard[fromIndex] = {
        color: finalBoard[fromIndex].color,
        pieceType: "Q",
      };
    }
    finalBoard[toIndex] = "";
    finalBoard = swap(finalBoard, toIndex, fromIndex);
    captureAudio.play();
    setInCheck(finalBoard, boardProps, dispatch);
    dispatch({ action: "moved-piece", board: board, movingPiece: fromIndex });
    return finalBoard;
  }
}

const moveAudio = new Audio(moveSound);
const captureAudio = new Audio(captureSound);

function Board(props) {
  const [board, setBoard] = useState(orgBoard);
  return (
    <div className="board">
      {board.map((piece, i) => {
        return (
          <Square
            piece={piece}
            squareColor={getSquareColor(i)}
            key={i}
            index={i}
            showMoves={(index) => {
              if (!props.boardProps.gameEnd) {
                props.dispatch({
                  action: "show-moves",
                  index: index,
                  board: board,
                });
              }
            }}
            movable={props.boardProps.movableSquares.includes(i)}
            isMoving={props.boardProps.isMoving}
            movePiece={(toIndex) => {
              setBoard((board) => {
                return movePiece(
                  board,
                  props.boardProps,
                  props.dispatch,
                  props.boardProps.movingPiece,
                  toIndex
                );
              });
              // movePiece(
              //   board,
              //   setBoard,
              //   props.boardProps,
              //   props.dispatch,
              //   props.boardProps.movingPiece,
              //   toIndex
              // );
            }}
            selected={props.boardProps.movingPiece}
            inCheck={props.boardProps[`${piece.color}InCheck`]}
          />
        );
      })}
    </div>
  );
}

export default Board;
