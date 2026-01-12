
class Player{
    constructor(id, name){
        this.name = name;
        this.id = id;
        this.isAlive = true;
        this.linesCleared = 0;
        this.currentPieceIndex = 0;
        this.pendingPenaltyLines = 0;
        this.board = null; // Store the player's board for spectrum view
        this.currentPiece = null; // {type, x, y, rotation} - Active piece state
        this.gameLoopTimer = null; // setInterval reference for gravity
        this.lastInputTime = 0; // For input throttling
    }

    lose(){
        this.isAlive = false;
        this.cleanup(); // Clean up timers when player loses
    }

    clearLines(count){
        this.linesCleared += count;
    }

    addPenaltyLines(count){
        this.pendingPenaltyLines += count;
    }

    updateBoard(board){
        this.board = board;
    }

    cleanup(){
        if (this.gameLoopTimer) {
            clearInterval(this.gameLoopTimer);
            this.gameLoopTimer = null;
        }
    }
}

export default Player;