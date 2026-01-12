import Piece from './Piece.js';
import { createEmptyBoard, canPlacePiece, placePiece, clearLines, BOARD_WIDTH } from '../utils/board.js';
import { moveDown, moveLeft, moveRight, rotate, hardDrop } from '../utils/movement.js';
import { getShape } from '../utils/pieces.js';

class Game {
    constructor(roomName) {
        this.roomName = roomName;
        this.players = [];
        this.state = 'waiting';
        this.pieceSequence = [];
        this.maxPieceIndex = 0;
        this.host = null;
    }

    reset(){
        this.players = [];
        this.state = 'waiting';
        this.pieceSequence = [];
        this.currentPieceIndex = 0;
        this.host = null;
    }

    addPlayer(player){
        const existingPlayer = this.players.find(p => p.name === player.name);
        if (existingPlayer) {
            existingPlayer.id = player.id;
            if (this.host && this.host.name === player.name) {
                this.host = existingPlayer;
            }
            return true;
        }

        this.players.push(player)
        if (this.players.length === 1)
            this.host = player;
        return true;
    }

    removePlayer(playerOrId) {
        const playerId = typeof playerOrId === 'string' ? playerOrId : playerOrId.id;
        const index = this.players.findIndex(p => p.id === playerId);
        if (index !== -1) {
            if (this.host?.id === playerId && this.players.length > 1)
                this.host = this.players[index === 0 ? 1 : 0];
            this.players.splice(index, 1);
            if (this.players.length === 0) 
                this.reset();
        }
    }

    start(){
        if (this.players.length === 0)
            return false

        this.players.forEach(p => {
            p.isAlive = true;
            p.linesCleared = 0;
            p.currentPieceIndex = 0;
            p.pendingPenaltyLines = 0;
            p.board = createEmptyBoard();
            p.currentPiece = null;
            p.lastInputTime = 0;
        });

        this.state = 'playing';
        this.pieceSequence = [];
        this.generatePieceSequence(100)
        this.maxPieceIndex = 0;
        return true;
    }

    generatePieceSequence(count){
        const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        let lastType = null;
        for (let i = 0; i < count; i++) {
            let randomType;
            do {
                const randomIndex = Math.floor(Math.random() * types.length);
                randomType = types[randomIndex];
            } while (randomType === lastType);
            const piece = new Piece(randomType, 3, 0);
            this.pieceSequence.push(piece);
            lastType = randomType;
        }
    }

    getNextPiece(player){
        if (this.maxPieceIndex >= this.pieceSequence.length)
            this.generatePieceSequence(50);
        let piece = this.pieceSequence[player.currentPieceIndex];
        player.currentPieceIndex++;
        if (player.currentPieceIndex >= this.maxPieceIndex)
            this.maxPieceIndex = player.currentPieceIndex
        return piece
    }

    getPlayer(id){
        for (const player of this.players){
            if (player.id === id)
                return player
        }
        return null;
    }

    checkWinner() {
        const playersAlive = this.players.filter(p => p.isAlive);

        if (playersAlive.length === 0) {
            this.state = 'finished';
            return null;
        }

        if (this.players.length > 1 && playersAlive.length === 1) {
            this.state = 'finished';
            return playersAlive[0];
        }

        return null;
    }

    startGameLoops(io) {
        this.players.forEach(player => {
            if (player.isAlive) {
                this.startPlayerGameLoop(player, io);
            }
        });
    }

    startPlayerGameLoop(player, io) {
        if (player.gameLoopTimer) {
            clearInterval(player.gameLoopTimer);
        }

        player.gameLoopTimer = setInterval(() => {
            if (!player.isAlive || this.state !== 'playing') {
                clearInterval(player.gameLoopTimer);
                player.gameLoopTimer = null;
                return;
            }

            this.autoDropPiece(player, io);
        }, 1000);
    }

    autoDropPiece(player, io) {
        if (!player.currentPiece) return;

        const newPiece = moveDown(player.board, player.currentPiece);

        if (newPiece === player.currentPiece) {
            this.lockPiece(player, io);
        } else {
            player.currentPiece = newPiece;
            io.to(this.roomName).emit('piece:position-update', {
                playerId: player.id,
                piece: newPiece
            });
        }
    }

    lockPiece(player, io) {
        if (!player.currentPiece) return;

        const shape = getShape(player.currentPiece);
        const boardWithPiece = placePiece(
            player.board,
            shape,
            player.currentPiece.x,
            player.currentPiece.y,
            player.currentPiece.type
        );

        const { board: boardAfterClear, linesCleared } = clearLines(boardWithPiece);

        if (player.pendingPenaltyLines > 0) {
            this.applyPenaltyLines(player, boardAfterClear);
        } else {
            player.board = boardAfterClear;
        }

        player.currentPiece = null;

        io.to(player.id).emit('piece:locked', {
            board: player.board,
            linesCleared
        });

        io.to(this.roomName).emit('player:board-update', {
            playerId: player.id,
            playerName: player.name,
            board: player.board
        });

        if (linesCleared > 0) {
            player.clearLines(linesCleared);
            const penalty = linesCleared - 1;

            if (penalty > 0) {
                this.players.forEach(p => {
                    if (p.id !== player.id && p.isAlive) {
                        p.addPenaltyLines(penalty);
                        io.to(p.id).emit('penalty:received', { lines: penalty });
                    }
                });
            }

            io.to(this.roomName).emit('player:line-cleared', {
                playerId: player.id,
                playerName: player.name,
                linesCleared,
                totalLines: player.linesCleared
            });
        }

        setTimeout(() => {
            if (player.isAlive && this.state === 'playing') {
                this.spawnNextPiece(player, io);
            }
        }, 200);
    }

    applyPenaltyLines(player, baseBoard) {
        const penaltyLines = [];
        for (let i = 0; i < player.pendingPenaltyLines; i++) {
            const line = Array(BOARD_WIDTH).fill('PENALTY');
            const randomGap = Math.floor(Math.random() * BOARD_WIDTH);
            line[randomGap] = 0;
            penaltyLines.push(line);
        }

        const newBoard = baseBoard.slice(player.pendingPenaltyLines);
        player.board = [...newBoard, ...penaltyLines];
        player.pendingPenaltyLines = 0;
    }

    spawnNextPiece(player, io) {
        if (!player.isAlive || this.state !== 'playing') return;

        const piece = this.getNextPiece(player);
        player.currentPiece = { ...piece };

        const shape = getShape(piece);
        const canSpawn = canPlacePiece(player.board, shape, piece.x, piece.y);

        if (!canSpawn) {
            player.lose();

            io.to(this.roomName).emit('player:lost', {
                playerId: player.id,
                playerName: player.name
            });

            const winner = this.checkWinner();
            if (winner) {
                io.to(this.roomName).emit('game:winner', {
                    winner: {
                        id: winner.id,
                        name: winner.name,
                        linesCleared: winner.linesCleared
                    },
                    status: 'finished'
                });
                this.cleanup();

                this.state = 'waiting';
                io.to(this.roomName).emit('game:status-update', {
                    status: 'waiting'
                });
            } else if (this.state === 'finished') {
                this.cleanup();

                this.state = 'waiting';
                io.to(this.roomName).emit('game:status-update', {
                    status: 'waiting'
                });
            }
        } else {
            io.to(player.id).emit('piece:spawn', { piece });
            io.to(this.roomName).emit('piece:position-update', {
                playerId: player.id,
                piece
            });
        }
    }

    handlePlayerInput(player, action, io) {
        if (!player.currentPiece || !player.isAlive) return;
        if (this.state !== 'playing') return;

        const now = Date.now();
        const bypassThrottle = (action === 'hardDrop' || action === 'rotate');

        if (!bypassThrottle && now - player.lastInputTime < 50) return;
        player.lastInputTime = now;

        let newPiece;

        switch(action) {
            case 'left':
                newPiece = moveLeft(player.board, player.currentPiece);
                break;
            case 'right':
                newPiece = moveRight(player.board, player.currentPiece);
                break;
            case 'down':
                newPiece = moveDown(player.board, player.currentPiece);
                break;
            case 'rotate':
                newPiece = rotate(player.board, player.currentPiece);
                break;
            case 'hardDrop':
                newPiece = hardDrop(player.board, player.currentPiece);
                player.currentPiece = newPiece;
                this.lockPiece(player, io);
                return;
        }

        if (newPiece && newPiece !== player.currentPiece) {
            player.currentPiece = newPiece;
            io.to(this.roomName).emit('piece:position-update', {
                playerId: player.id,
                piece: newPiece
            });
        }
    }

    cleanup() {
        this.players.forEach(player => player.cleanup());
    }
}

export default Game;