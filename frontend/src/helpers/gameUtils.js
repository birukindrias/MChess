import {
  inCheck,
  checkCheckmated,
  swap,
  checkPromotion,
  castledBoard,
  isCastling,
} from "./utils";
import moveSound from "../assets/sounds/Move.ogg";
import captureSound from "../assets/sounds/Capture.ogg";

export function setInCheck(board, boardProps, setBoardProps, callback) {
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

      setBoardProps({ action: "end-game", callback });
      return;
    } else {
      setBoardProps({ action: "in-check", kingColor: kingColor, callback });
    }
  }
}

const moveAudio = new Audio(moveSound);
const captureAudio = new Audio(captureSound);

export function movePiece(boardProps, dispatch, fromIndex, toIndex, callback) {
  let finalBoard;
  const board = boardProps.board;
  if (isCastling(board, fromIndex, toIndex, boardProps)) {
    moveAudio.play();
    finalBoard = castledBoard(board, fromIndex, toIndex);
    dispatch({
      action: "move-piece",
      board: finalBoard,
      movingPiece: toIndex,
      callback,
    });
    return finalBoard;
  } else if (board[toIndex] === "") {
    moveAudio.play();
    let finalBoard = [...board];
    if (checkPromotion(board, fromIndex, toIndex)) {
      finalBoard[fromIndex] = {
        color: finalBoard[fromIndex].color,
        pieceType: "Q",
      };
    }
    finalBoard = swap(finalBoard, fromIndex, toIndex);
    dispatch({
      action: "move-piece",
      board: finalBoard,
      movingPiece: toIndex,
      callback,
    });
    setInCheck(finalBoard, boardProps, dispatch, callback);
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
    dispatch({
      action: "move-piece",
      board: finalBoard,
      movingPiece: toIndex,
      callback,
    });
    setInCheck(finalBoard, boardProps, dispatch, callback);
    return finalBoard;
  }
}
