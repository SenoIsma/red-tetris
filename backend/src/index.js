import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

import gameManager from './managers/GameManager.js';
import Player from './models/Player.js'


const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.URL_FRONTEND,
        methods: ["GET", "POST"]
    }
});

const socketRooms = new Map(); //Map <socketId, roomName>

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
    
    
    socket.on("player:join", ({ roomName, playerName }) => {
        const game = gameManager.getOrCreateGame(roomName);
        const player = new Player(socket.id, playerName);
        const success = game.addPlayer(player);
        if (!success){
            socket.emit("error", {message: "Cannot join game"});
            return;
        }
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
            const piece = game.getNextPiece(player);
            io.to(player.id).emit("piece:spawn", { piece });
        }

        console.log(`Game started in room ${roomName}`);
    });


    socket.on("piece:request", ({ roomName }) => {
        const game = verifyGame(socket, roomName)
        if (!game)
            return;
        const player = game.getPlayer(socket.id);
        if (!player){
            socket.emit("error", { message: "Player not found"});
            return;
        }
        const piece = game.getNextPiece(player);
        socket.emit("piece:spawn", { piece });
    });


    socket.on("piece:lock", ({roomName, piece, board, linesCleared}) => {
        const game = verifyGame(socket, roomName)
        if (!game)
            return;

        const player = game.getPlayer(socket.id);
        if (!player) {
            socket.emit("error", {messsage: "Player not found"});
            return;
        }

        const expectedPiece = game.pieceSequence[player.currentPieceIndex - 1];
        if (!expectedPiece || piece.type !== expectedPiece.type){
            socket.emit("error", {message: "Invalid piece!"});
            return;
        }

        if (linesCleared > 0){
            player.clearLines(linesCleared);
            const penalty = linesCleared - 1;
            if (penalty > 0){
                game.players.forEach(p => {
                    if (p.id !== player.id && p.isAlive)
                        io.to(p.id).emit("penalty:received", {lines: penalty });
                });
            }
            io.to(roomName).emit("player:line-cleared", {
                playerId: player.id,
                playerName: player.name,
                linesCleared : linesCleared,
                totalLines: player.linesCleared
            });
        }

    });


    socket.on("player:lose", ({ roomName }) => {
        const game = gameManager.getGame(roomName);
        if (!game) return;

        const player = game.getPlayer(socket.id);
        if (!player) return;

        player.lose();
        io.to(roomName).emit("player:lost", {
            playerId: player.id,
            playerName: player.name
        });
        const winner = game.checkWinner();
        if (winner) {
            io.to(roomName).emit("game:winner", {
                winner: winner,
                status: 'finished'
            });

            io.to(roomName).emit("game:status-update", {
                status: 'finished'
            });
        } else if (game.state === 'finished') {
            io.to(roomName).emit("game:status-update", {
                status: 'finished'
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("Client déconnecté:", socket.id);
        const roomName = socketRooms.get(socket.id);
        if (!roomName) return;
        const game = gameManager.getGame(roomName);
        if (!game) return;
        game.removePlayer(socket.id);
        socketRooms.delete(socket.id);

        io.to(roomName).emit("game:players-update", {
            players: game.players, host: game.host
        });
    });
});



server.listen(process.env.PORT, () =>{
    console.log("Server started on port " + process.env.PORT);
});