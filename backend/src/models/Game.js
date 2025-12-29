import Piece from './Piece.js';

class Game {
    constructor(roomName) {
        this.roomName = roomName;
        this.players = [];
        this.state = 'waiting';
        this.pieceSequence = [];
        this.currentPieceIndex = 0;
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
        if (this.state === 'playing' || this.players.find(p => p.name === player.name))
            return false;
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
        this.state = 'playing';
        this.generatePieceSequence(100)
        this.currentPieceIndex = 0;
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

    getNextPiece(){
        if (this.currentPieceIndex >= this.pieceSequence.length)
            this.generatePieceSequence(50);
        let piece = this.pieceSequence[this.currentPieceIndex];
        this.currentPieceIndex++;
        return piece
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
}

export default Game;