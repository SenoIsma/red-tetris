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

export const placePiece = (board, piece, x, y) => {
    const newBoard = board.map(n => [...n]);

    piece.forEach(bloc => {
        const absX = x + bloc[0];
        const absY = y + bloc[1];
        newBoard[absY][absX] = 1;
    });
    return newBoard;
};

export const clearLines = (board) => {
    const remainingLines = board.filter(line =>{
        return (!line.every(n => n !== 0))
    });
    const linesCleared = BOARD_HEIGHT - remainingLines.length;
    const newLines = Array(linesCleared).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
    return [...newLines, ...remainingLines];
};