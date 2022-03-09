import {
  getRookMoves,
  getBishopMoves,
  getPawnMoves,
  getKnightMoves,
  getKingMoves,
} from "./pieceMoves";

export function getSquareColor(index) {
  const { row, col } = getRowCol(index);
  if (row % 2 === 0) {
    return col % 2 === 0 ? "light" : "dark";
  } else {
    return col % 2 === 0 ? "dark" : "light";
  }
}

export function getRowCol(index) {
  return {
    row: Math.floor(index / 8) + 1,
    col: index + 1 - Math.floor(index / 8) * 8,
  };
}

export function getIndex(row, col) {
  // Error giving index if either row or column is invalid
  if (row > 8 || col > 8 || row <= 0 || col <= 0) {
    return -1;
  }
  return col - 1 + 8 * (row - 1);
}

export function canMoveTo(board, pieceIndex, index) {
  if (index < 0 || index > 63) {
    return false;
  }
  const piece = board[pieceIndex];
  if (!board[index]) {
    return true;
  } else if (board[index] && board[index].color !== piece.color) {
    return true;
  }
  return false;
}

export function swap(array, index1, index2) {
  let swappedArray = [...array];
  const tmp = swappedArray[index2];
  swappedArray[index2] = swappedArray[index1];
  swappedArray[index1] = tmp;
  return swappedArray;
}

function checkCanAttackKing(board, index, kingIndex) {
  switch (board[index].pieceType) {
    case "B":
      if (getBishopMoves(board, index).includes(kingIndex)) {
        return true;
      }
      break;
    case "p":
      if (getPawnMoves(board, index).includes(kingIndex)) {
        return true;
      }
      break;
    case "H":
      if (getKnightMoves(board, index).includes(kingIndex)) {
        return true;
      }
      break;
    case "R":
      if (getRookMoves(board, index).includes(kingIndex)) {
        return true;
      }
      break;
    case "Q":
      if (
        getBishopMoves(board, index).includes(kingIndex) ||
        getRookMoves(board, index).includes(kingIndex)
      ) {
        return true;
      }
      break;
    case "K":
      if (getKingMoves(board, index).includes(kingIndex)) {
        return true;
      }
      break;
  }
}

export function inCheck(board, kingColor) {
  const kingIndex = board.findIndex((curPiece) => {
    if (curPiece.color === kingColor && curPiece.pieceType === "K") {
      return true;
    }
  });
  const diagonalMoves = getBishopMoves(board, kingIndex);
  const verticalMoves = getRookMoves(board, kingIndex);
  const knightMoves = getKnightMoves(board, kingIndex);

  for (let index of diagonalMoves) {
    if (board[index] && board[index].color !== kingColor) {
      if (checkCanAttackKing(board, index, kingIndex)) {
        return true;
      }
    }
  }
  for (let index of verticalMoves) {
    if (board[index] && board[index].color !== kingColor) {
      if (checkCanAttackKing(board, index, kingIndex)) {
        return true;
      }
    }
  }
  for (let index of knightMoves) {
    if (board[index] && board[index].color !== kingColor) {
      if (checkCanAttackKing(board, index, kingIndex)) {
        return true;
      }
    }
  }
  return false;
}

function checkModifiedBoardInCheck(orgBoard, kingColor, fromIndex, toIndex) {
  let board = [...orgBoard];
  if (board[toIndex]) {
    board[toIndex] = "";
    board = swap(board, fromIndex, toIndex);
  } else {
    board = swap(board, fromIndex, toIndex);
  }
  return inCheck(board, kingColor);
}

export function checkCheckmated(board, kingColor) {
  let isCheckmated = false;
  for (let curIndex = 0; curIndex < board.length; curIndex++) {
    if (isCheckmated) break;
    const piece = board[curIndex];
    if (piece === "" || piece.color !== kingColor) continue;
    let moves = [];
    switch (piece.pieceType) {
      case "p":
        moves = getPawnMoves(board, curIndex);
        break;
      case "B":
        moves = getBishopMoves(board, curIndex);
        break;
      case "H":
        moves = getKnightMoves(board, curIndex);
        break;
      case "R":
        moves = getRookMoves(board, curIndex);
        break;
      case "K":
        moves = getKingMoves(board, curIndex);
        break;
      case "Q":
        moves = getRookMoves(board, curIndex);
        moves.concat(getBishopMoves(board, curIndex));
        break;
    }
    for (let toIndex of moves) {
      if (!checkModifiedBoardInCheck(board, kingColor, curIndex, toIndex)) {
        isCheckmated = true;
        break;
      }
    }
  }
  return !isCheckmated;
}

export function checkPromotion(board, curIndex, toIndex) {
  if (board[curIndex].pieceType !== "p") return false;
  if (board[curIndex].color === "white") {
    return getRowCol(toIndex).row === 8;
  } else {
    return getRowCol(toIndex).row === 1;
  }
}

export function checkCastlingRights(
  currentPieceIndex,
  pieceType,
  boardProps,
  returnObj
) {
  if (pieceType === "K") {
    returnObj.canWhiteKingSideCastle =
      boardProps.currentMove === "white"
        ? false
        : boardProps.canWhiteKingSideCastle;
    returnObj.canWhiteQueenSideCastle =
      boardProps.currentMove === "white"
        ? false
        : boardProps.canWhiteQueenSideCastle;
    returnObj.canBlackKingSideCastle =
      boardProps.currentMove === "black"
        ? false
        : boardProps.canBlackKingSideCastle;
    returnObj.canBlackQueenSideCastle =
      boardProps.currentMove === "black"
        ? false
        : boardProps.canBlackQueenSideCastle;
  } else if (pieceType === "R" && [0, 7, 56, 63].includes(currentPieceIndex)) {
    switch (currentPieceIndex) {
      case 7:
        returnObj.canWhiteQueenSideCastle = false;
        break;
      case 0:
        returnObj.canWhiteKingSideCastle = false;
        break;
      case 56:
        returnObj.canBlackKingSideCastle = false;
        break;
      case 63:
        returnObj.canBlackQueenSideCastle = false;
        break;
    }
  }
}

export function castledBoard(board, kingIndex, toIndex) {
  let finalBoard = [...board];
  finalBoard = swap(finalBoard, kingIndex, toIndex);
  switch (toIndex) {
    case 1:
      finalBoard = swap(finalBoard, 0, 2);
      break;
    case 5:
      finalBoard = swap(finalBoard, 7, 4);
      break;
    case 57:
      finalBoard = swap(finalBoard, 56, 58);
      break;
    case 61:
      finalBoard = swap(finalBoard, 63, 60);
      break;
  }
  return finalBoard;
}
