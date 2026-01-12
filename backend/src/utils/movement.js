import { canPlacePiece } from "./board.js";
import { getShape, rotatePiece } from "./pieces.js";


export const moveLeft = (board, piece) => {
    const newPiece = {
        ...piece,
        x: piece.x - 1
    };
    const shape = getShape(newPiece);
    if (canPlacePiece(board, shape, newPiece.x, newPiece.y))
        return newPiece;
    return piece;
};

export const moveRight = (board, piece) => {
    const newPiece = {
        ...piece,
        x: piece.x + 1
    };
    const shape = getShape(newPiece);
    if (canPlacePiece(board, shape, newPiece.x, newPiece.y))
        return newPiece;
    return piece;
};

export const moveDown = (board, piece) => {
    const newPiece = {
        ...piece,
        y: piece.y + 1
    };
    const shape = getShape(newPiece);
    if (canPlacePiece(board, shape, newPiece.x, newPiece.y))
        return newPiece;
    return piece;
};

export const rotate = (board, piece) => {
    const newPiece = rotatePiece(piece);
    const shape = getShape(newPiece);
    if (canPlacePiece(board, shape, newPiece.x, newPiece.y))
        return newPiece;
    return piece;
};

export const hardDrop = (board, piece) => {
    let currentPos = piece;
    let nextPos = moveDown(board, currentPos);

    while(nextPos !== currentPos){
        currentPos = nextPos;
        nextPos = moveDown(board, currentPos);
    }
    return currentPos;
};
