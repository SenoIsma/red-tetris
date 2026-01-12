import { placePiece } from "../utils/board";
import { getShape, getPieceColor } from "../utils/pieces";
import './Board.css'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { clearPenaltyLines } from "../store/slices/gameSlice.js";
import socket from "../utils/socket.js";


const Board = ({ roomName, playerName }) => {
  const dispatch = useDispatch();
  const currentPiece = useSelector(state => state.game.currentPiece);
  const gameStatus = useSelector(state => state.game.gameStatus);
  const [board, setBoard] = useState(Array(20).fill(0).map(() => Array(10).fill(0)));
  const [isGameOver, setIsGameOver] = useState(false);
  const [playingPiece, setPlayingPiece] = useState(null);

  useEffect(() => {
    const handlePieceSpawn = ({ piece }) => {
      console.log(`[Frontend] Nouvelle pièce reçue:`, piece.type);
      setPlayingPiece({ ...piece });
    };

    const handlePieceUpdate = ({ playerId, piece }) => {
      if (playerId === socket.id) {
        setPlayingPiece(piece);
      }
    };

    const handlePieceLocked = ({ board: newBoard, linesCleared }) => {
      console.log(`[Frontend] Pièce verrouillée. Lignes clearées:`, linesCleared);
      setBoard(newBoard);
      setPlayingPiece(null);
    };

    const handlePlayerLost = ({ playerId }) => {
      if (playerId === socket.id) {
        setIsGameOver(true);
      }
    };

    socket.on('piece:spawn', handlePieceSpawn);
    socket.on('piece:position-update', handlePieceUpdate);
    socket.on('piece:locked', handlePieceLocked);
    socket.on('player:lost', handlePlayerLost);

    return () => {
      socket.off('piece:spawn', handlePieceSpawn);
      socket.off('piece:position-update', handlePieceUpdate);
      socket.off('piece:locked', handlePieceLocked);
      socket.off('player:lost', handlePlayerLost);
    };
  }, []);

  const prevGameStatusRef = useRef(gameStatus);
  useEffect(() => {
    if (prevGameStatusRef.current !== 'playing' && gameStatus === 'playing') {
      setBoard(createEmptyBoard());
      setIsGameOver(false);
      setPlayingPiece(null);
      dispatch(clearPenaltyLines());
    }
    prevGameStatusRef.current = gameStatus;
  }, [gameStatus, dispatch]);

  useEffect(() => {
    if (isGameOver || gameStatus !== 'playing' || !playingPiece) return;

    const keysPressed = new Set();
    const intervals = {};

    const sendAction = (action) => {
      socket.emit('input:action', { roomName, action });
    };

    const handleKeyDown = event => {
      const key = event.key;

      if (keysPressed.has(key)) return;

      let action = null;
      let useRepeat = false;

      if (key === 'ArrowLeft') {
        action = 'left';
        useRepeat = true;
      } else if (key === 'ArrowRight') {
        action = 'right';
        useRepeat = true;
      } else if (key === 'ArrowDown') {
        action = 'down';
        useRepeat = true;
      } else if (key === 'ArrowUp') {
        action = 'rotate';
        useRepeat = false;
      } else if (key === ' ') {
        action = 'hardDrop';
        useRepeat = false;
      }

      if (action) {
        event.preventDefault();
        keysPressed.add(key);

        sendAction(action);

        if (useRepeat) {
          const initialTimeout = setTimeout(() => {
            intervals[key] = setInterval(() => {
              if (keysPressed.has(key)) {
                sendAction(action);
              }
            }, 10);
          }, 10);

          intervals[key] = initialTimeout;
        }
      }
    };

    const handleKeyUp = event => {
      const key = event.key;
      keysPressed.delete(key);

      if (intervals[key]) {
        clearTimeout(intervals[key]);
        clearInterval(intervals[key]);
        delete intervals[key];
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);

      Object.values(intervals).forEach(interval => {
        clearTimeout(interval);
        clearInterval(interval);
      });
    };
  }, [playingPiece, isGameOver, gameStatus, roomName]);

  const shape = playingPiece ? getShape(playingPiece) : null;
  const displayBoard = !playingPiece
    ? board
    : placePiece(board, shape, playingPiece.x, playingPiece.y, playingPiece.type);

  const handleRestart = () => {
    setBoard(createEmptyBoard());
    setIsGameOver(false);
  }

  return(
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {playerName && (
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
          {playerName}
        </div>
      )}
      <div className="board">
        {displayBoard.map((line, y) => (
          <div key={y} className="row">
              {line.map((value, x) => (
                <div
                key={x}
                className="cell"
                style={{ backgroundColor: value != 0 ? getPieceColor(value) : '#111' }}
                ></div>
              ))}
           </div>
        ))}
        <div>
          {isGameOver && (
            <div className="game-over">
              <h2>Game Over!</h2>
              <button onClick={handleRestart}>Restart</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default Board;