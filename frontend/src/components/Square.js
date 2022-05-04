import Piece from "./Piece";

function Square(props) {
  const movableHighlight = props.movable ? "movable-highlight" : "";
  const kingInCheck =
    props.inCheck && props.piece.pieceType === "K" ? "kingCheck" : "";
  return (
    <div
      onClick={() => {
        if (props.isMoving && props.movable) {
          props.movePiece(props.index);
        }
      }}
      className={`square square-${props.squareColor} ${movableHighlight} ${
        props.piece && props.movable ? "movable-piece" : ""
      } ${
        props.selected === props.index ? "selected-square" : ""
      } ${kingInCheck}`}
    >
      {!props.piece && props.movable ? <div className="movable"></div> : null}
      {props.piece ? (
        <Piece
          showMoves={props.showMoves}
          piece={props.piece}
          index={props.index}
        />
      ) : null}
    </div>
  );
}

export default Square;
