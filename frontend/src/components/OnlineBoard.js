import Square from "../components/Square";
import { getSquareColor } from "../helpers/utils";

function OnlineBoard({ boardProps, dispatch, player_color, makeMove }) {
  return (
    <>
      <div className="board">
        {boardProps.board.map((piece, i) => {
          return (
            <Square
              piece={piece}
              squareColor={getSquareColor(i)}
              key={i}
              index={i}
              showMoves={(index) => {
                if (
                  !boardProps.gameEnd &&
                  boardProps.currentMove == player_color
                ) {
                  dispatch({
                    action: "show-moves",
                    index,
                    board: boardProps.board,
                  });
                }
              }}
              movable={boardProps.movableSquares.includes(i)}
              isMoving={boardProps.isMoving}
              movePiece={makeMove}
              selected={boardProps.movingPiece}
              inCheck={boardProps[`${piece.color}InCheck`]}
            />
          );
        })}
      </div>
    </>
  );
}

export default OnlineBoard;
