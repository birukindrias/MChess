import Square from "./Square";
import { useReducer, useState } from "react";
import {
  getSquareColor,
  swap,
  inCheck,
  checkCheckmated,
  checkPromotion,
  checkCastlingRights,
  castledBoard,
  getMoves,
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

      setBoardProps({ action: "end-game" });
      return;
    } else {
      setBoardProps({ action: "in-check", kingColor: kingColor });
    }
  }
}

function isCastling(board, currentIndex, toIndex, boardProps) {
  if (board[currentIndex].pieceType !== "K") {
    return false;
  }
  const color = board[currentIndex].color;
  switch (toIndex) {
    case 1:
      if (color === "white" && boardProps.canWhiteKingSideCastle) {
        return true;
      } else {
        return false;
      }
    case 5:
      if (color === "white" && boardProps.canWhiteQueenSideCastle) {
        return true;
      } else {
        return false;
      }
    case 57:
      if (color === "black" && boardProps.canBlackKingSideCastle) {
        return true;
      } else {
        return false;
      }
    case 61:
      if (color === "black" && boardProps.canBlackQueenSideCastle) {
        return true;
      } else {
        return false;
      }
    default:
      return false;
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
      } else {
        return {
          ...boardProps,
          isMoving: true,
          movableSquares: indexes,
          movingPiece: action.index,
        };
      }
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

function Board(props) {
  const [board, setBoard] = useState(orgBoard);
  const [boardProps, dispatch] = useReducer(reducer, orgBoardProps);

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
                dispatch({ action: "show-moves", index: index, board: board });
              }}
              movable={boardProps.movableSquares.includes(i)}
              isMoving={boardProps.isMoving}
              movePiece={(toIndex) => {
                movePiece(board, setBoard, boardProps, dispatch, toIndex);
                props.setTurn(
                  boardProps.currentMove === "white" ? "black" : "white"
                );
              }}
              selected={boardProps.movingPiece}
              inCheck={boardProps[`${piece.color}InCheck`]}
            />
          );
        })}
      </div>
    </>
  );
}

export default Board;
