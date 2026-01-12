import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import socket from '../socket.js'
import { inputProtection } from "../protection.js";
import { useDispatch, useSelector } from "react-redux";
import { setHostId, setPlayers, setGameStatus, setCurrentPiece, addPenaltyLines, setWinner } from "../store/slices/gameSlice.js";
import Board from "../components/Board.jsx";
import OpponentSpectrum from "../components/OpponentSpectrum.jsx";

function Game(){
    const {roomName, playerName} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const players = useSelector(state=>state.game.players);
    const hostId = useSelector(state=>state.game.hostId);
    const gameStatus = useSelector(state=>state.game.gameStatus);
    const winner = useSelector(state=>state.game.winner);
    const playerHost = players.find(p => p.id === hostId);
    const [socketId, setSocketId] = useState(null);
    const [opponentSpectrums, setOpponentSpectrums] = useState([]);
    const [opponentPieces, setOpponentPieces] = useState({}); // Track active pieces per player
    const isHost = socketId === hostId;
    const hasJoinedRef = useRef(false);

    useEffect(() => {
        if (!inputProtection(playerName, roomName)){
            navigate('/');
            return;
        }
    }, [roomName, playerName, navigate]);

    useEffect(() => {
        setSocketId(socket.id);

        if (!hasJoinedRef.current) {
            hasJoinedRef.current = true;
            socket.emit('player:join', {roomName, playerName});
        }

        socket.on('error', (data) => {
            alert(data.message);
            navigate('/');
        });

        socket.on('game:players-update', (data) => {
            dispatch(setPlayers(data.players));
            dispatch(setHostId(data.host.id));
            setSocketId(socket.id);
        });

        socket.on('game:status-update', (data) => {
            dispatch(setGameStatus(data.status));

            if (data.status === 'playing') {
                const opponents = players
                    .filter(p => p.id !== socket.id)
                    .map(p => ({
                        playerId: p.id,
                        playerName: p.name,
                        board: null,
                        isAlive: true
                    }));
                setOpponentSpectrums(opponents);
                setOpponentPieces({});
            }
        });

        socket.on('piece:spawn', (data) => {
            dispatch(setCurrentPiece(data.piece));
        });

        socket.on('game:winner', (data) => {
            dispatch(setWinner(data.winner));
            dispatch(setGameStatus(data.status));
        });

        socket.on('player:lost', (data) => {
            console.log(`${data.playerName} a perdu!`);

            if (data.playerId !== socket.id) {
                setOpponentSpectrums(prev =>
                    prev.map(o => o.playerId === data.playerId ? { ...o, isAlive: false } : o)
                );
                setOpponentPieces(prev => {
                    const newPieces = { ...prev };
                    delete newPieces[data.playerId];
                    return newPieces;
                });
            }
        });

        socket.on('player:line-cleared', (data) => {
            console.log(`${data.playerName} a nettoyé ${data.linesCleared} ligne(s)! Total: ${data.totalLines}`);
        });

        socket.on('player:board-update', (data) => {
            if (data.playerId !== socket.id) {
                setOpponentSpectrums(prev => {
                    const index = prev.findIndex(o => o.playerId === data.playerId);
                    if (index >= 0) {
                        const newSpectrums = [...prev];
                        newSpectrums[index] = { ...newSpectrums[index], board: data.board };
                        return newSpectrums;
                    } else {
                        return [...prev, { playerId: data.playerId, playerName: data.playerName, board: data.board, isAlive: true }];
                    }
                });
            }
        });

        socket.on('piece:position-update', (data) => {
            if (data.playerId !== socket.id) {
                setOpponentPieces(prev => ({
                    ...prev,
                    [data.playerId]: data.piece
                }));
            }
        });

        socket.on('piece:locked', () => {
        });

        return () => {
            socket.off('error');
            socket.off('game:players-update');
            socket.off('game:status-update');
            socket.off('piece:spawn');
            socket.off('game:winner');
            socket.off('player:lost');
            socket.off('player:line-cleared');
            socket.off('player:board-update');
            socket.off('piece:position-update');
            socket.off('piece:locked');
        };
    }, [roomName, playerName, dispatch, navigate]);

    const handleStartGame = () => {
        if (isHost && gameStatus === 'waiting') {
            socket.emit('game:start', { roomName });
        }
    };

    return(
        <div>
            <h1> {`Game Page - ${playerName} dans ${roomName}`} </h1>

            {gameStatus === 'waiting' && (
                <>
                    {winner && (
                        <div style={{
                            marginBottom: '20px',
                            padding: '20px',
                            backgroundColor: '#1a1a1a',
                            borderRadius: '8px',
                            border: '3px solid #4ade80',
                            textAlign: 'center',
                            maxWidth: '600px',
                            margin: '0 auto 30px auto'
                        }}>
                            <h2 style={{ margin: '0 0 10px 0', color: '#4ade80' }}>🎮 Partie terminée!</h2>
                            <p style={{ fontSize: '20px', margin: '0', fontWeight: 'bold' }}>
                                Vainqueur : {winner.name}
                            </p>
                        </div>
                    )}

                    <h2>Joueurs connectés (host : {playerHost?.name || "En attente..."}):</h2>
                    <ul>
                        {players.map(p => <li key={p.id}>{p.name}</li>)}
                    </ul>
                    {isHost && (
                        <button onClick={handleStartGame}>
                            Lancer la partie
                        </button>
                    )}
                    {!isHost && <p>En attente que l'hôte lance la partie...</p>}
                </>
            )}

            {gameStatus === 'playing' && (
                <div>
                    <h2>Partie en cours</h2>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Board roomName={roomName} playerName={playerName} />
                        {opponentSpectrums.map(opponent => (
                            <OpponentSpectrum
                                key={opponent.playerId}
                                playerName={opponent.playerName}
                                board={opponent.board}
                                isAlive={opponent.isAlive}
                                activePiece={opponentPieces[opponent.playerId]}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Game;