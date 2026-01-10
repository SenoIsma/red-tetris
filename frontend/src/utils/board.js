export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const createEmptyBoard = () => {
    return Array(BOARD_HEIGHT).fill(0).map(() => Array (BOARD_WIDTH).fill(0));
};

export const canPlacePiece = (board, piece, x, y) => {
    return piece.every((bloc) => {
        const absX = x + bloc[0];
        const absY = y + bloc[1];
    
        if (absX < 0 || absX >= BOARD_WIDTH)
            return false;
        if (absY < 0 || absY >= BOARD_HEIGHT)
            return false;
        if (board[absY][absX] !== 0)
            return false;
        return true;
    });
};

export const placePiece = (board, piece, x, y, pieceType) => {
    const newBoard = board.map(n => [...n]);

    piece.forEach(bloc => {
        const absX = x + bloc[0];
        const absY = y + bloc[1];
        newBoard[absY][absX] = pieceType;
    });
    return newBoard;
};

export const clearLines = (board) => {
    let linesCleared = 0;
    const newBoard = board.filter(line => {
        const isFull = line.every(cell => cell !== 0);
        if (isFull) {
            linesCleared++;
            return false;
        }
        return true;
    });
    while (newBoard.length < 20) {
        newBoard.unshift(Array(10).fill(0));
    }

    return { board: newBoard, linesCleared };
};