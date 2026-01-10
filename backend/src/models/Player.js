
class Player{
    constructor(id, name){
        this.name = name;
        this.id = id;
        this.isAlive = true;
        this.linesCleared = 0;
        this.currentPieceIndex = 0;
        this.PenaltyLines = 0;
    }

    lose(){
        this.isAlive = false;
    }

    clearLines(count){
        this.linesCleared += count;
    }

    addPenaltyLines(count){
        this.PenaltyLines += count;
    }
}

export default Player;