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