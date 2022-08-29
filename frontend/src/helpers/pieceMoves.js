import { getRowCol, getIndex, canMoveTo, inCheck, swap } from "./utils";

export function getRookMoves(board, index) {
  let movableIndexes = [];
  let { row, col } = getRowCol(index);

  let upperVerticalEnd = false;
  let lowerVerticalEnd = false;
  let upperHorizontalEnd = false;
  let lowerHorizontalEnd = false;
  for (let i = 1; i < 8; i++) {
    if (
      upperVerticalEnd &&
      lowerVerticalEnd &&
      upperHorizontalEnd &&
      lowerHorizontalEnd
    ) {
      break;
    }
    if (!upperVerticalEnd) {
      if (board[getIndex(row + i, col)]) {
        upperVerticalEnd = true;
      }
      if (canMoveTo(board, index, getIndex(row + i, col))) {
        movableIndexes.push(getIndex(row + i, col));
      } else {
        upperVerticalEnd = true;
      }
    }
    if (!lowerVerticalEnd) {
      if (board[getIndex(row - i, col)]) {
        lowerVerticalEnd = true;
      }
      if (canMoveTo(board, index, getIndex(row - i, col))) {
        movableIndexes.push(getIndex(row - i, col));
      } else {
        lowerVerticalEnd = true;
      }
    }

    if (!upperHorizontalEnd) {
      if (board[getIndex(row, col + i)]) {
        upperHorizontalEnd = true;
      }
      if (canMoveTo(board, index, getIndex(row, col + i))) {
        movableIndexes.push(getIndex(row, col + i));
      } else {
        upperHorizontalEnd = true;
      }
    }

    if (!lowerHorizontalEnd) {
      if (board[getIndex(row, col - i)]) {
        lowerHorizontalEnd = true;
      }
      if (canMoveTo(board, index, getIndex(row, col - i))) {
        movableIndexes.push(getIndex(row, col - i));
      } else {
        lowerHorizontalEnd = true;
      }
    }
  }
  return movableIndexes;
}

export function getBishopMoves(board, index) {
  let movableIndexes = [];
  let { row, col } = getRowCol(index);

  let forwardRightEnd = false;
  let backwardRightEnd = false;
  let forwardLeftEnd = false;
  let backwardLeftEnd = false;
  for (let i = 1; i <= 8; i++) {
    if (
      forwardRightEnd &&
      forwardLeftEnd &&
      backwardLeftEnd &&
      backwardRightEnd
    ) {
      break;
    }
    if (!forwardRightEnd) {
      if (board[getIndex(row + i, col + i)]) {
        forwardRightEnd = true;
      }
      if (canMoveTo(board, index, getIndex(row + i, col + i))) {
        movableIndexes.push(getIndex(row + i, col + i));
      } else {
        forwardRightEnd = true;
      }
    }
    if (!backwardRightEnd) {
      if (board[getIndex(row - i, col - i)]) {
        backwardRightEnd = true;
      }
      if (canMoveTo(board, index, getIndex(row - i, col - i))) {
        movableIndexes.push(getIndex(row - i, col - i));
      } else {
        backwardRightEnd = true;
      }
    }
    if (!forwardLeftEnd) {
      if (board[getIndex(row + i, col - i)]) {
        forwardLeftEnd = true;
      }
      if (canMoveTo(board, index, getIndex(row + i, col - i))) {
        movableIndexes.push(getIndex(row + i, col - i));
      } else {
        forwardLeftEnd = true;
      }
    }

    if (!backwardLeftEnd) {
      if (board[getIndex(row - i, col + i)]) {
        backwardLeftEnd = true;
      }
      if (canMoveTo(board, index, getIndex(row - i, col + i))) {
        movableIndexes.push(getIndex(row - i, col + i));
      } else {
        backwardLeftEnd = true;
      }
    }
  }
  return movableIndexes;
}

function canCastle(board, index, castleType) {
  const king = board[index];
  const { row, col } = getRowCol(index);
  if (castleType === "kingside") {
    if (board[getIndex(row, col - 1)] || board[getIndex(row, col - 2)]) {
      return false;
    }
    for (let i = 1; i <= 2; i++) {
      let tmp = [...board];
      swap(tmp, index, index - i);
      if (inCheck(tmp, king.color)) {
        return false;
      }
    }
    return true;
  } else if (castleType === "queenside") {
    if (board[getIndex(row, col + 1)] || board[getIndex(row, col + 2)] || board[getIndex(row, col + 3)]) {
      return false;
    }
    for (let i = 1; i <= 2; i++) {
      let tmp = [...board];
      swap(tmp, index, index + i);
      if (inCheck(tmp, king.color)) {
        return false;
      }
    }
    return true;
  }
}

export function getKingMoves(
  board,
  index,
  canKingSideCastle,
  canQueenSideCastle,
  inCheck
) {
  let movableIndexes = [];
  let { row, col } = getRowCol(index);

  if (canMoveTo(board, index, getIndex(row + 1, col))) {
    movableIndexes.push(getIndex(row + 1, col));
  }
  if (canMoveTo(board, index, getIndex(row + 1, col + 1))) {
    movableIndexes.push(getIndex(row + 1, col + 1));
  }
  if (canMoveTo(board, index, getIndex(row, col + 1))) {
    movableIndexes.push(getIndex(row, col + 1));
  }
  if (canMoveTo(board, index, getIndex(row, col - 1))) {
    movableIndexes.push(getIndex(row, col - 1));
  }
  if (canMoveTo(board, index, getIndex(row + 1, col - 1))) {
    movableIndexes.push(getIndex(row + 1, col - 1));
  }
  if (canMoveTo(board, index, getIndex(row - 1, col))) {
    movableIndexes.push(getIndex(row - 1, col));
  }
  if (canMoveTo(board, index, getIndex(row - 1, col + 1))) {
    movableIndexes.push(getIndex(row - 1, col + 1));
  }
  if (canMoveTo(board, index, getIndex(row - 1, col - 1))) {
    movableIndexes.push(getIndex(row - 1, col - 1));
  }
  if (!inCheck && canKingSideCastle && canCastle(board, index, "kingside")) {
    movableIndexes.push(getIndex(row, col - 2));
  }
  if (!inCheck && canQueenSideCastle && canCastle(board, index, "queenside")) {
    movableIndexes.push(getIndex(row, col + 2));
  }
  return movableIndexes;
}

export function getKnightMoves(board, index) {
  let movableIndexes = [];
  let { row, col } = getRowCol(index);

  if (canMoveTo(board, index, getIndex(row + 2, col + 1))) {
    movableIndexes.push(getIndex(row + 2, col + 1));
  }
  if (canMoveTo(board, index, getIndex(row + 2, col - 1))) {
    movableIndexes.push(getIndex(row + 2, col - 1));
  }
  if (canMoveTo(board, index, getIndex(row + 1, col + 2))) {
    movableIndexes.push(getIndex(row + 1, col + 2));
  }
  if (canMoveTo(board, index, getIndex(row + 1, col - 2))) {
    movableIndexes.push(getIndex(row + 1, col - 2));
  }
  if (canMoveTo(board, index, getIndex(row - 1, col + 2))) {
    movableIndexes.push(getIndex(row - 1, col + 2));
  }
  if (canMoveTo(board, index, getIndex(row - 1, col - 2))) {
    movableIndexes.push(getIndex(row - 1, col - 2));
  }
  if (canMoveTo(board, index, getIndex(row - 2, col + 1))) {
    movableIndexes.push(getIndex(row - 2, col + 1));
  }
  if (canMoveTo(board, index, getIndex(row - 2, col - 1))) {
    movableIndexes.push(getIndex(row - 2, col - 1));
  }
  return movableIndexes;
}

export function getPawnMoves(board, index) {
  let movableIndexes = [];
  let { row, col } = getRowCol(index);

  switch (board[index].color) {
    case "white":
      if (
        !board[getIndex(row + 1, col)] &&
        canMoveTo(board, index, getIndex(row + 1, col))
      ) {
        movableIndexes.push(getIndex(row + 1, col));
      }
      if (
        row === 2 &&
        !board[getIndex(row + 2, col)] &&
        !board[getIndex(row + 1, col)] &&
        canMoveTo(board, index, getIndex(row + 2, col))
      ) {
        movableIndexes.push(getIndex(row + 2, col));
      }
      if (
        board[getIndex(row + 1, col + 1)] &&
        board[getIndex(row + 1, col + 1)].color !== "white"
      ) {
        movableIndexes.push(getIndex(row + 1, col + 1));
      }
      if (
        board[getIndex(row + 1, col - 1)] &&
        board[getIndex(row + 1, col - 1)].color !== "white"
      ) {
        movableIndexes.push(getIndex(row + 1, col - 1));
      }
      break;
    case "black":
      if (
        !board[getIndex(row - 1, col)] &&
        canMoveTo(board, index, getIndex(row - 1, col))
      ) {
        movableIndexes.push(getIndex(row - 1, col));
      }
      if (
        row === 7 &&
        !board[getIndex(row - 2, col)] &&
        !board[getIndex(row - 1, col)] &&
        canMoveTo(board, index, getIndex(row - 2, col))
      ) {
        movableIndexes.push(getIndex(row - 2, col));
      }
      if (
        board[getIndex(row - 1, col + 1)] &&
        board[getIndex(row - 1, col + 1)].color !== "black"
      ) {
        movableIndexes.push(getIndex(row - 1, col + 1));
      }
      if (
        board[getIndex(row - 1, col - 1)] &&
        board[getIndex(row - 1, col - 1)].color !== "black"
      ) {
        movableIndexes.push(getIndex(row - 1, col - 1));
      }
  }

  return movableIndexes;
}
