import { getMoves, checkCastlingRights } from "./utils";

export function getTimeFormat(gameInfo) {
  const time = gameInfo.time;
  const increment = gameInfo.increment;

  return `${time}|${increment}`;
}

export function sendMove(fromIndex, toIndex, ws) {
  ws.send(
    JSON.stringify({
      type: "command",
      action: "make-move",
      fromIndex,
      toIndex,
    })
  );
}

export function reducer(boardProps, action) {
  switch (action.action) {
    case "show-moves":
      if (boardProps.board[action.index].color !== boardProps.currentMove) {
        return boardProps;
      }
      const indexes = getMoves(boardProps, action.index);
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
      action.callback({ ...boardProps, gameEnd: true });
      return {
        ...boardProps,
        gameEnd: true,
      };
    case "in-check":
      let returnObj = { ...boardProps };
      returnObj[`${action.kingColor}InCheck`] = true;
      action.callback(returnObj);
      return returnObj;
    case "move-piece":
      const finalBoardProps = {
        ...checkCastlingRights(
          action.movingPiece,
          action.board[action.movingPiece].pieceType,
          boardProps
        ),
        isMoving: false,
        currentMove: boardProps.currentMove === "white" ? "black" : "white",
        whiteInCheck: false,
        blackInCheck: false,
        movingPiece: null,
        movableSquares: [],
        board: action.board,
      };
      action.callback(finalBoardProps);
      return finalBoardProps;
    case "set-boardprops":
      return action.boardProps;
  }
}
