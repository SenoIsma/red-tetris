export const placePiece = (board, piece, x, y, pieceType) => {
    const newBoard = board.map(n => [...n]);

    piece.forEach(bloc => {
        const absX = x + bloc[0];
        const absY = y + bloc[1];
        newBoard[absY][absX] = pieceType;
    });
    return newBoard;
};
