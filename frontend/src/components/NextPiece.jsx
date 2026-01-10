import { getShape, getPieceColor } from "../utils/pieces";
import './NextPiece.css';

const NextPiece = ({ piece }) => {
  const shape = getShape(piece);
  const color = getPieceColor(piece.type);

  const grid = Array(4).fill(0).map(() => Array(4).fill(0));

  shape.forEach(([x, y]) => {
    if (y + 1 < 4 && x + 1 < 4) {
      grid[y + 1][x + 1] = piece.type;
    }
  });

  return (
    <div className="next-piece-container">
      <h3>Next Piece</h3>
      <div className="next-piece-grid">
        {grid.map((row, y) => (
          <div key={y} className="next-piece-row">
            {row.map((cell, x) => (
              <div
                key={x}
                className="next-piece-cell"
                style={{ backgroundColor: cell !== 0 ? color : '#222' }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextPiece;