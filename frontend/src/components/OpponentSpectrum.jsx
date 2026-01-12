import './OpponentSpectrum.css';
import { getPieceColor, getShape } from '../utils/pieces';

const OpponentSpectrum = ({ playerName, board, isAlive, activePiece }) => {
  if (!board) {
    return (
      <div className={`opponent-spectrum ${!isAlive ? 'dead' : ''}`}>
        <div className="opponent-name">{playerName}</div>
        <div className="mini-board">
          <div className="loading">En attente...</div>
        </div>
      </div>
    );
  }

  const displayBoard = [...board.map(row => [...row])];

  if (activePiece) {
    const shape = getShape(activePiece);
    shape.forEach(([dx, dy]) => {
      const x = activePiece.x + dx;
      const y = activePiece.y + dy;
      if (y >= 0 && y < displayBoard.length && x >= 0 && x < displayBoard[0].length) {
        displayBoard[y][x] = activePiece.type;
      }
    });
  }

  return (
    <div className={`opponent-spectrum ${!isAlive ? 'dead' : ''}`}>
      <div className="opponent-name">{playerName}</div>
      <div className="mini-board">
        {displayBoard.map((row, y) => (
          <div key={y} className="mini-row">
            {row.map((cell, x) => (
              <div
                key={x}
                className="mini-cell"
                style={{
                  backgroundColor: cell !== 0 ? getPieceColor(cell) : '#111'
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpponentSpectrum;
