import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

import gameManager from './managers/GameManager.js';
import Player from './models/Player.js';


const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const socketRooms = new Map();
const disconnectTimers = new Map();

const verifyGame = (socket, roomName) => {
    const game = gameManager.getGame(roomName)
    if (!game){
        socket.emit("error", {message: "Game not found"});
        return null;
    }
    return game;
}

io.on("connection", socket => {
    console.log("Nouveau client connecté:", socket.id);

    socket.on("player:check-username", ({ roomName, playerName }, callback) => {
        const game = gameManager.getGame(roomName);

        if (!game) {
            callback({ available: true });
            return;
        }

        const existingPlayer = game.players.find(p => p.name === playerName);
        if (existingPlayer && existingPlayer.id !== socket.id) {
            callback({ available: false, error: "Username already taken in this room" });
            return;
        }

        if (game.state === 'playing') {
            callback({ available: false, error: "Cannot join game: game already started" });
            return;
        }

        if (game.players.length >= 4 && !existingPlayer) {
            callback({ available: false, error: "Cannot join game: room is full (max 4 players)" });
            return;
        }

        callback({ available: true });
    });

    socket.on("player:join", ({ roomName, playerName }) => {
        const game = gameManager.getOrCreateGame(roomName);

        const existingPlayer = game.players.find(p => p.name === playerName);
        if (existingPlayer && existingPlayer.id !== socket.id) {
            socket.emit("error", {message: "Username already taken in this room"});
            return;
        }

        if (game.state === 'playing') {
            socket.emit("error", {message: "Cannot join game: game already started"});
            return;
        }

        if (game.players.length >= 4 && !existingPlayer) {
            socket.emit("error", {message: "Cannot join game: room is full (max 4 players)"});
            return;
        }

        if (existingPlayer) {
            const oldSocketId = existingPlayer.id;
            if (disconnectTimers.has(oldSocketId)) {
                clearTimeout(disconnectTimers.get(oldSocketId));
                disconnectTimers.delete(oldSocketId);
                console.log(`Reconnection detected for ${playerName}, cancelling removal`);
            }

            const oldRoomName = socketRooms.get(oldSocketId);
            if (oldRoomName) {
                socketRooms.delete(oldSocketId);
            }
        }

        const player = new Player(socket.id, playerName);
        game.addPlayer(player);

        socket.join(roomName);
        socketRooms.set(socket.id, roomName);

        io.to(roomName).emit("game:players-update", {
            players: game.players, host: game.host
        });

        console.log(`${playerName} a rejoint ${roomName}`);
    });


    socket.on("game:start", ({ roomName }) => {
        const game = verifyGame(socket, roomName)
        if (!game)
            return;

        if (socket.id !== game.host.id) {
            socket.emit("error", { message: "Only host can start the game" });
            return;
        }

        const success = game.start();
        if (!success) {
            socket.emit("error", { message: "Cannot start game" });
            return;
        }

        io.to(roomName).emit("game:status-update", {
            status: 'playing'
        });

        for (const player of game.players){
            io.to(roomName).emit("player:board-update", {
                playerId: player.id,
                playerName: player.name,
                board: player.board
            });
        }

        for (const player of game.players){
            game.spawnNextPiece(player, io);
        }

        game.startGameLoops(io);

        console.log(`Game started in room ${roomName}`);
    });

    socket.on("input:action", ({ roomName, action }) => {
        const game = verifyGame(socket, roomName);
        if (!game) return;

        const player = game.getPlayer(socket.id);
        if (!player) {
            socket.emit("error", { message: "Player not found" });
            return;
        }

        const validActions = ['left', 'right', 'down', 'rotate', 'hardDrop'];
        if (!validActions.includes(action)) {
            return;
        }

        game.handlePlayerInput(player, action, io);
    });

    socket.on("player:lose", ({ roomName }) => {
        const game = gameManager.getGame(roomName);
        if (!game) return;

        if (game.state !== 'playing') return;

        const player = game.getPlayer(socket.id);
        if (!player) return;

        if (!player.isAlive) return;

        player.lose();
        console.log(`Player ${player.name} lost in room ${roomName}`);

        io.to(roomName).emit("player:lost", {
            playerId: player.id,
            playerName: player.name
        });

        const winner = game.checkWinner();
        if (winner) {
            console.log(`Winner detected: ${winner.name}`);
            io.to(roomName).emit("game:winner", {
                winner: {
                    id: winner.id,
                    name: winner.name,
                    linesCleared: winner.linesCleared
                },
                status: 'finished'
            });

            game.cleanup();

            game.state = 'waiting';
            io.to(roomName).emit("game:status-update", {
                status: 'waiting'
            });
        } else if (game.state === 'finished') {
            console.log(`Game finished with no winner (tie)`);
            game.cleanup();

            game.state = 'waiting';
            io.to(roomName).emit("game:status-update", {
                status: 'waiting'
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("Client déconnecté:", socket.id);
        const roomName = socketRooms.get(socket.id);
        if (!roomName) return;
        const game = gameManager.getGame(roomName);
        if (!game) return;

        const player = game.getPlayer(socket.id);
        if (!player) return;

        player.cleanup();

        if (game.state === 'playing') {
            console.log(`Player ${player.name} disconnected during game - marked as lost`);
            player.lose();

            io.to(roomName).emit("player:lost", {
                playerId: player.id,
                playerName: player.name
            });

            const winner = game.checkWinner();
            if (winner) {
                io.to(roomName).emit("game:winner", {
                    winner: {
                        id: winner.id,
                        name: winner.name,
                        linesCleared: winner.linesCleared
                    },
                    status: 'finished'
                });

                game.cleanup();

                game.state = 'waiting';
                io.to(roomName).emit("game:status-update", {
                    status: 'waiting'
                });
            } else if (game.state === 'finished') {
                game.cleanup();

                game.state = 'waiting';
                io.to(roomName).emit("game:status-update", {
                    status: 'waiting'
                });
            }
            return;
        }

        const timer = setTimeout(() => {
            const playerCheck = game.getPlayer(socket.id);
            if (!playerCheck) return;

            console.log(`Removing player ${playerCheck.name} after disconnect timeout`);
            game.removePlayer(socket.id);
            socketRooms.delete(socket.id);
            disconnectTimers.delete(socket.id);

            io.to(roomName).emit("game:players-update", {
                players: game.players, host: game.host
            });
        }, 5000);

        disconnectTimers.set(socket.id, timer);
    });
});



server.listen(process.env.PORT, () =>{
    console.log("Server started on port " + process.env.PORT);
});