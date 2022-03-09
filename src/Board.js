import Square from "./Square";
import { useState } from "react";
import {
  getSquareColor,
  swap,
  inCheck,
  checkCheckmated,
  checkPromotion,
  checkCastlingRights,
  castledBoard,
} from "./utils";
import {
  getPawnMoves,
  getBishopMoves,
  getRookMoves,
  getKnightMoves,
  getKingMoves,
} from "./pieceMoves";
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

      setBoardProps({ ...boardProps, gameEnd: true });
      return;
    } else {
      setBoardProps((boardProps) => {
        let finalObj = { ...boardProps };
        finalObj[`${kingColor}InCheck`] = true;
        return finalObj;
      });
    }
  }
}

function isCastling(board, currentIndex, toIndex, boardProps) {
  if (board[currentIndex].pieceType !== "K") {
    return false;
  }
  switch (toIndex) {
    case 1:
      if (
        board[currentIndex].color === "white" &&
        boardProps.canWhiteKingSideCastle
      ) {
        return true;
      } else {
        return false;
      }
    case 5:
      if (
        board[currentIndex].color === "white" &&
        boardProps.canWhiteQueenSideCastle
      ) {
        return true;
      } else {
        return false;
      }
    case 57:
      if (
        board[currentIndex].color === "black" &&
        boardProps.canBlackKingSideCastle
      ) {
        return true;
      } else {
        return false;
      }
    case 61:
      if (
        board[currentIndex].color === "black" &&
        boardProps.canBlackQueenSideCastle
      ) {
        return true;
      } else {
        return false;
      }
  }
}
function movePiece(
  board,
  setBoard,
  boardProps,
  setBoardProps,
  editMoveAction,
  currentPieceIndex,
  toIndex
) {
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
    setInCheck(
      swap(board, currentPieceIndex, toIndex),
      boardProps,
      setBoardProps
    );
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
    setInCheck(finalBoard, boardProps, setBoardProps);
  }
  editMoveAction({ movableSquares: [], pieceIndex: null });
  setBoardProps((boardProps) => {
    let returnObj = { ...boardProps };
    returnObj.isMoving = false;
    returnObj.currentMove =
      boardProps.currentMove === "white" ? "black" : "white";
    if (returnObj[`${boardProps.currentMove}InCheck`]) {
      returnObj[`${boardProps.currentMove}InCheck`] = false;
    }
    if (
      boardProps.canBlackQueenSideCastle ||
      boardProps.canWhiteKingSideCastle ||
      boardProps.canWhiteQueenSideCastle ||
      boardProps.canBlackKingSideCastle
    ) {
      checkCastlingRights(
        currentPieceIndex,
        board[currentPieceIndex].pieceType,
        boardProps,
        returnObj
      );
    }
    return returnObj;
  });
}

function getMoves(board, boardProps, index) {
  let movableIndexes = [];
  const pieceType = board[index].pieceType;
  switch (pieceType) {
    case "R":
      movableIndexes = movableIndexes.concat(getRookMoves(board, index));
      break;
    case "p":
      movableIndexes = movableIndexes.concat(getPawnMoves(board, index));
      break;
    case "H":
      movableIndexes = movableIndexes.concat(getKnightMoves(board, index));
      break;
    case "B":
      movableIndexes = movableIndexes.concat(getBishopMoves(board, index));
      break;
    case "K":
      movableIndexes = movableIndexes.concat(
        getKingMoves(
          board,
          index,
          boardProps[
            `can${
              boardProps.currentMove.charAt(0).toUpperCase() +
              boardProps.currentMove.slice(1)
            }KingSideCastle`
          ],
          boardProps[
            `can${
              boardProps.currentMove.charAt(0).toUpperCase() +
              boardProps.currentMove.slice(1)
            }QueenSideCastle`
          ],
          boardProps[`${boardProps.currentMove}InCheck`]
        )
      );
      break;
    case "Q":
      movableIndexes = movableIndexes.concat(getRookMoves(board, index));
      movableIndexes = movableIndexes.concat(getBishopMoves(board, index));
  }
  // don't allow moves that don't block the check
  if (boardProps[`${boardProps.currentMove}InCheck`] || pieceType === "K") {
    movableIndexes = movableIndexes.filter((toIndex) => {
      if (board[toIndex] === "") {
        return !inCheck(swap(board, index, toIndex), boardProps.currentMove);
      } else {
        let tmp = [...board];
        tmp[toIndex] = "";
        return !inCheck(swap(tmp, toIndex, index), boardProps.currentMove);
      }
    });
  }
  return movableIndexes;
}

function showPossibleMoves(
  index,
  board,
  boardProps,
  setBoardProps,
  editMoveAction
) {
  // Don't show possible moves if you're checkmated or if it's not your move
  if (board[index].color !== boardProps.currentMove || boardProps.gameEnd) {
    return;
  }
  const indexes = getMoves(board, boardProps, index);
  editMoveAction((ms) => {
    if (ms.pieceIndex === index) {
      setBoardProps((boardProps) => {
        return {
          ...boardProps,
          isMoving: false,
        };
      });
      return {
        movableSquares: [],
        pieceIndex: null,
      };
    } else {
      setBoardProps((boardProps) => {
        return {
          ...boardProps,
          isMoving: true,
        };
      });
      return {
        movableSquares: indexes,
        pieceIndex: index,
      };
    }
  });
}

const moveAudio = new Audio(moveSound);
const captureAudio = new Audio(captureSound);

function Board() {
  const [board, setBoard] = useState(orgBoard);
  const [moveAction, editMoveAction] = useState({
    movableSquares: [],
    pieceIndex: null,
  });

  const [boardProps, setBoardProps] = useState({
    currentMove: "white",
    isMoving: false,
    canWhiteKingSideCastle: true,
    canWhiteQueenSideCastle: true,
    canBlackKingSideCastle: true,
    canBlackQueenSideCastle: true,
    whiteInCheck: false,
    blackInCheck: false,
    gameEnd: false,
  });

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
              showPossibleMoves(
                index,
                board,
                boardProps,
                setBoardProps,
                editMoveAction
              );
            }}
            movable={moveAction.movableSquares.includes(i)}
            isMoving={boardProps.isMoving}
            movePiece={(toIndex) => {
              movePiece(
                board,
                setBoard,
                boardProps,
                setBoardProps,
                editMoveAction,
                moveAction.pieceIndex,
                toIndex
              );
            }}
            selected={moveAction.pieceIndex}
            inCheck={boardProps[`${piece.color}InCheck`]}
          />
        );
      })}
    </div>
  );
}

export default Board;
