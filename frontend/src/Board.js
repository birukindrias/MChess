import Square from "./Square";
import { useState } from "react";
import {
  getSquareColor,
  swap,
  inCheck,
  checkCheckmated,
  checkPromotion,
  castledBoard,
  isCastling,
} from "./utils";
import moveSound from "./assets/sounds/Move.ogg";
import captureSound from "./assets/sounds/Capture.ogg";

const orgBoard = [
  { color: "white", pieceType: "R" },
  { color: "white", pieceType: "H" },
  { color: "white", pieceType: "B" },
  { color: "white", pieceType: "K" },
  { color: "white", pieceType: "Q" },
  { color: "white", pieceType: "B" },
  { color: "white", pieceType: "H" },
  { color: "white", pieceType: "R" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
  { color: "white", pieceType: "p" },
]
  .concat(Array(32).fill(""))
  .concat([
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "p" },
    { color: "black", pieceType: "R" },
    { color: "black", pieceType: "H" },
    { color: "black", pieceType: "B" },
    { color: "black", pieceType: "K" },
    { color: "black", pieceType: "Q" },
    { color: "black", pieceType: "B" },
    { color: "black", pieceType: "H" },
    { color: "black", pieceType: "R" },
  ]);

function setInCheck(board, boardProps, setBoardProps) {
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

function movePiece(board, setBoard, boardProps, dispatch, toIndex) {
  const currentPieceIndex = boardProps.movingPiece;
  if (isCastling(board, currentPieceIndex, toIndex, boardProps)) {
    moveAudio.play();
    setBoard(castledBoard(board, currentPieceIndex, toIndex));
  } else if (board[toIndex] === "") {
    moveAudio.play();
    setBoard((board) => {
      if (checkPromotion(board, currentPieceIndex, toIndex)) {
        board[currentPieceIndex] = {
          color: board[currentPieceIndex].color,
          pieceType: "Q",
        };
      }
      return swap(board, currentPieceIndex, toIndex);
    });
    setInCheck(swap(board, currentPieceIndex, toIndex), boardProps, dispatch);
  } else {
    let finalBoard = [...board];
    if (checkPromotion(board, currentPieceIndex, toIndex)) {
      finalBoard[currentPieceIndex] = {
        color: finalBoard[currentPieceIndex].color,
        pieceType: "Q",
      };
    }
    finalBoard[toIndex] = "";
    finalBoard = swap(finalBoard, toIndex, currentPieceIndex);
    setBoard(finalBoard);
    captureAudio.play();
    setInCheck(finalBoard, boardProps, dispatch);
  }
  dispatch({ action: "moved-piece", board: board });
}

const moveAudio = new Audio(moveSound);
const captureAudio = new Audio(captureSound);

function Board(props) {
  const [board, setBoard] = useState(orgBoard);
  return (
    <>
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
                movePiece(
                  board,
                  setBoard,
                  props.boardProps,
                  props.dispatch,
                  toIndex
                );
              }}
              selected={props.boardProps.movingPiece}
              inCheck={props.boardProps[`${piece.color}InCheck`]}
            />
          );
        })}
      </div>
    </>
  );
}

export default Board;
