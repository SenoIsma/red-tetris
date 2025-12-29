
class Player{
    constructor(id, name){
        this.name = name;
        this.id = id;
        this.isAlive = true;
        this.linesCleared = 0;
    }

    lose(){
        this.isAlive = false;
    }

    clearLines(count){
        this.linesCleared += count;
    }
}

export default Player;