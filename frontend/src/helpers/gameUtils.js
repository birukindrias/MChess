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

const moveAudio = new Audio(moveSound);
const captureAudio = new Audio(captureSound);

export function movePiece(boardProps, dispatch, fromIndex, toIndex) {
  let finalBoard;
  const board = boardProps.board;
  if (isCastling(board, fromIndex, toIndex, boardProps)) {
    moveAudio.play();
    finalBoard = castledBoard(board, fromIndex, toIndex);
    dispatch({
      action: "move-piece",
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
    dispatch({
      action: "move-piece",
      board: finalBoard,
      movingPiece: fromIndex,
    });
    setInCheck(finalBoard, boardProps, dispatch);
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
      movingPiece: fromIndex,
    });
    setInCheck(finalBoard, boardProps, dispatch);
    return finalBoard;
  }
}
