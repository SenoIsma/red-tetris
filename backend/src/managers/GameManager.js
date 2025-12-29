import Game from '../models/Game.js';

class gameManager {
    constructor(){
        this.games = {};
    }

    createGame(roomName){
        if (roomName in this.games)
            return null;
        this.games[roomName] = new Game(roomName);
        return this.games[roomName];
    }

    getGame(roomName){
        return this.games[roomName];
    }

    getOrCreateGame(roomName){
        if (roomName in this.games)
            return this.getGame(roomName);
        else
            return this.createGame(roomName);
    }

    deleteGame(roomName){
        if (roomName in this.games){
            delete this.games[roomName];
            return true;
        }
        return false;
    }

    getAllGames(){
        return Object.values(this.games);
    }
}

export default new gameManager();