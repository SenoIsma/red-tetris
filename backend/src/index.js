import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.URL_FRONTEND,
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {});

server.listen(process.env.PORT, () =>{
    console.log("Server started on port " + process.env.PORT);
});


