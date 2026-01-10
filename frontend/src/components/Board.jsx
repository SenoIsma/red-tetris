import { createEmptyBoard, placePiece, clearLines, canPlacePiece } from "../utils/board";
import { getShape, getPieceColor } from "../utils/pieces";
import './Board.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import { hardDrop, moveDown, moveLeft, moveRight, rotate } from '../utils/movement.js'
import { useDispatch, useSelector } from "react-redux";
import { clearPenaltyLines } from "../store/slices/gameSlice.js";
import socket from "../socket.js";


const Board = ({ roomName }) => {
  const dispatch = useDispatch();
  const currentPiece = useSelector(state => state.game.currentPiece);
  const pendingPenaltyLines = useSelector(state => state.game.pendingPenaltyLines);
  const [board, setBoard] = useState(createEmptyBoard());
  const boardRef = useRef(board);
  const pieceRef = useRef(currentPiece);
  const [isLocked, setIsLocked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playingPiece, setPlayingPiece] = useState(null);
  

  const lockIn = useCallback( (newPiece, bo) => {
    const shape = getShape(newPiece);
    const boardWithPiece = placePiece(bo, shape, newPiece.x, newPiece.y, newPiece.type);
    const { board: boardAfterClear, linesCleared } = clearLines(boardWithPiece);
    setBoard(boardAfterClear);
    
    socket.emit('piece:lock', {
      roomName,
      piece: newPiece,
      board: boardAfterClear,
      linesCleared: linesCleared,
    })
  }, [roomName]);

  const spawnNewPiece = useCallback(() => {
    console.log(`[Frontend] Demande piece:request`);
    socket.emit('piece:request', { roomName });
  }, [roomName]);


  useEffect(() => {
    if (currentPiece){
      console.log(`[Frontend] Nouvelle pièce reçue de Redux:`, currentPiece.type, currentPiece);
      setPlayingPiece({ ...currentPiece })
    }
  }, [currentPiece]);
  
  
  useEffect(() => {
    boardRef.current = board;
    if (playingPiece)
      pieceRef.current = playingPiece;
  }, [board, playingPiece]);
  
  
  useEffect(() => {
      if (!currentPiece) return;
      const shape = getShape(currentPiece);
      const canPlace = canPlacePiece(board, shape, currentPiece.x, currentPiece.y);

      if (!canPlace) {
          setIsGameOver(true);
          socket.emit('player:lose', { roomName });
      }
  }, [currentPiece, board, roomName]);

  useEffect(() => {
    if (isGameOver) return;
    if (!playingPiece) return;
    let timer;
    const interval = setInterval(() => {
      const newPiece = moveDown(boardRef.current, pieceRef.current);
      if (newPiece === pieceRef.current){
        setIsLocked(true);
        lockIn(pieceRef.current, boardRef.current);
        timer = setTimeout(() => {
          spawnNewPiece();
          setIsLocked(false);
        }, 200);
      }else
        setPlayingPiece(newPiece);
      }, 1000);
      return () => {
      clearInterval(interval);
      if (timer) clearTimeout(timer);
    }
  }, [isGameOver, lockIn, spawnNewPiece, playingPiece]);

  useEffect(() => {
      if (pendingPenaltyLines > 0) {
          const penaltyLines = [];
          for (let i = 0; i < pendingPenaltyLines; i++) {
              const line = Array(10).fill('PENALTY');
              const randomGap = Math.floor(Math.random() * 10);
              line[randomGap] = 0;
              penaltyLines.push(line);
          }

          setBoard(prevBoard => {
              const newBoard = prevBoard.slice(pendingPenaltyLines);
              return [...newBoard, ...penaltyLines];
          });

          dispatch(clearPenaltyLines());
      }
  }, [pendingPenaltyLines]);
  
  useEffect(() => {
    const handleKeyPress = event => {
      if (isLocked) return;
      if (isGameOver) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)){
        event.preventDefault();
        let newPiece;
        if (event.key === 'ArrowLeft')
          newPiece = moveLeft(board, playingPiece);
        else if (event.key === 'ArrowRight')
          newPiece = moveRight(board, playingPiece);
        else if (event.key === 'ArrowDown')
          newPiece = moveDown(board, playingPiece);
        else if (event.key === 'ArrowUp')
          newPiece = rotate(board, playingPiece);
        if (newPiece)
          setPlayingPiece(newPiece);
        if (event.key === ' '){
          setIsLocked(true);
          newPiece = hardDrop(board, playingPiece);
          setPlayingPiece(newPiece);
          lockIn(newPiece, board);
          setTimeout(() => {
            spawnNewPiece();
            setIsLocked(false);
          }, 200);
        }
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [playingPiece, board]);
  
  if (!playingPiece){
    return <div>chargement de la piece...</div>;
  }
  
  const shape = getShape(playingPiece);
  const displayBoard = placePiece(board, shape, playingPiece.x, playingPiece.y, playingPiece.type);
  
  const handleRestart = () => {
    setBoard(createEmptyBoard());
    setIsGameOver(false);
  }
  
  


    return(
      <div style={{ display: 'flex' }}>
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