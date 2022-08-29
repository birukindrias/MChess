import Square from "../components/Square";
import { getSquareColor } from "../helpers/utils";
import { movePiece } from "../helpers/gameUtils";

function Board({ boardProps, dispatch }) {
  return (
    <div className="board">
      {boardProps.board.map((piece, i) => {
        return (
          <Square
            piece={piece}
            squareColor={getSquareColor(i)}
            key={i}
            index={i}
            showMoves={(index) => {
              if (!boardProps.gameEnd) {
                dispatch({
                  action: "show-moves",
                  index: index,
                });
              }
            }}
            movable={boardProps.movableSquares.includes(i)}
            isMoving={boardProps.isMoving}
            movePiece={(toIndex) => {
              movePiece(boardProps, dispatch, boardProps.movingPiece, toIndex);
            }}
            selected={boardProps.movingPiece}
            inCheck={boardProps[`${piece.color}InCheck`]}
          />
        );
      })}
    </div>
  );
}

export default Board;
