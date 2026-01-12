import { moveLeft, moveRight, moveDown, rotate, hardDrop } from '../../src/utils/movement.js';
import { createEmptyBoard } from '../../src/utils/board.js';

describe('movement.js', () => {

    let board;

    beforeEach(() => {
        board = createEmptyBoard();
    });

    describe('moveLeft()', () => {
        test('should move piece left when possible', () => {
            const piece = { type: 'I', x: 5, y: 0, rotation: 0 };
            const newPiece = moveLeft(board, piece);

            expect(newPiece.x).toBe(4);
            expect(newPiece.y).toBe(0);
            expect(newPiece).not.toBe(piece); // Nouveau objet
        });

        test('should not move left if at left wall', () => {
            const piece = { type: 'I', x: 0, y: 0, rotation: 0 };
            const newPiece = moveLeft(board, piece);

            // Devrait retourner la même pièce (pas bougé)
            expect(newPiece).toBe(piece);
            expect(newPiece.x).toBe(0);
        });

        test('should not move left if blocked by existing piece', () => {
            // Placer un obstacle à gauche
            board[0][3] = 'I';

            const piece = { type: 'O', x: 2, y: 0, rotation: 0 };
            // La pièce O occupe x=1,2 à y=0 (forme: [[1,0], [2,0], [1,1], [2,1]])
            // Si on bouge à gauche, x=1, ça occuperait x=2,3, donc collision avec board[0][3]

            const newPiece = moveLeft(board, piece);

            // Devrait retourner la même pièce (bloqué)
            expect(newPiece).toBe(piece);
        });
    });

    describe('moveRight()', () => {
        test('should move piece right when possible', () => {
            const piece = { type: 'I', x: 3, y: 0, rotation: 0 };
            const newPiece = moveRight(board, piece);

            expect(newPiece.x).toBe(4);
            expect(newPiece.y).toBe(0);
            expect(newPiece).not.toBe(piece);
        });

        test('should not move right if at right wall', () => {
            // Pièce I horizontale: occupe x à x+3
            // À x=6, elle occupe 6,7,8,9 (max du board)
            const piece = { type: 'I', x: 6, y: 0, rotation: 0 };
            const newPiece = moveRight(board, piece);

            // Devrait retourner la même pièce
            expect(newPiece).toBe(piece);
            expect(newPiece.x).toBe(6);
        });

        test('should not move right if blocked by existing piece', () => {
            // Placer un obstacle à droite
            board[0][5] = 'I';

            const piece = { type: 'O', x: 2, y: 0, rotation: 0 };
            const newPiece = moveRight(board, piece);

            // Devrait retourner la même pièce (bloqué)
            expect(newPiece).toBe(piece);
        });
    });

    describe('moveDown()', () => {
        test('should move piece down when possible', () => {
            const piece = { type: 'I', x: 3, y: 0, rotation: 0 };
            const newPiece = moveDown(board, piece);

            expect(newPiece.x).toBe(3);
            expect(newPiece.y).toBe(1);
            expect(newPiece).not.toBe(piece);
        });

        test('should not move down if at bottom', () => {
            // Pièce I horizontale à y=19 (dernière ligne)
            const piece = { type: 'I', x: 3, y: 19, rotation: 0 };
            const newPiece = moveDown(board, piece);

            // Devrait retourner la même pièce
            expect(newPiece).toBe(piece);
            expect(newPiece.y).toBe(19);
        });

        test('should not move down if blocked by existing piece', () => {
            // Pièce I verticale en rotation 1: [[2,0], [2,1], [2,2], [2,3]]
            // À x=3, y=0, elle occupe (5,0), (5,1), (5,2), (5,3)
            // Placer un obstacle à (5,4) pour la bloquer
            board[4][5] = 'I';

            const piece = { type: 'I', x: 3, y: 0, rotation: 1 }; // I vertical
            const newPiece = moveDown(board, piece);

            // La pièce devrait être bloquée à y=0
            expect(newPiece).toBe(piece);
        });
    });

    describe('rotate()', () => {
        test('should rotate piece when possible', () => {
            const piece = { type: 'I', x: 3, y: 5, rotation: 0 };
            const newPiece = rotate(board, piece);

            expect(newPiece.rotation).toBe(1);
            expect(newPiece.x).toBe(3);
            expect(newPiece.y).toBe(5);
            expect(newPiece).not.toBe(piece);
        });

        test('should cycle rotation from 3 to 0', () => {
            const piece = { type: 'J', x: 3, y: 5, rotation: 3 };
            const newPiece = rotate(board, piece);

            expect(newPiece.rotation).toBe(0);
        });

        test('should not rotate if blocked by wall', () => {
            // Pièce I à x=0, rotation 1 (verticale: [[2,0], [2,1], [2,2], [2,3]])
            // À x=0, elle occupe (2,0), (2,1), (2,2), (2,3)
            // Si on rotate à rotation 2, ça devient [[0,2], [1,2], [2,2], [3,2]]
            // Ce qui donne (0,2), (1,2), (2,2), (3,2) - ça passe
            // Utilisons J à la place
            const piece = { type: 'J', x: 0, y: 18, rotation: 2 };
            // J rotation 2: [[0,1], [1,1], [2,1], [2,2]]
            // Si on rotate vers rotation 3: [[0,2], [1,2], [1,1], [1,0]]
            // À y=18, ça sortirait du board (y+2 = 20)
            const newPiece = rotate(board, piece);

            // Devrait retourner la même pièce (rotation impossible)
            expect(newPiece).toBe(piece);
        });

        test('should not rotate if blocked by existing piece', () => {
            // Pièce I rotation 0: [[0,1], [1,1], [2,1], [3,1]]
            // À x=3, y=0, elle occupe (3,1), (4,1), (5,1), (6,1)
            // Si on rotate vers rotation 1: [[2,0], [2,1], [2,2], [2,3]]
            // À x=3, y=0, ça donnerait (5,0), (5,1), (5,2), (5,3)
            // Placer un obstacle à (5,2)
            board[2][5] = 'I';

            const piece = { type: 'I', x: 3, y: 0, rotation: 0 };
            const newPiece = rotate(board, piece);

            // La rotation devrait être bloquée
            expect(newPiece).toBe(piece);
        });

        test('should rotate piece O (square) successfully', () => {
            // La pièce O est la même à toutes les rotations
            const piece = { type: 'O', x: 4, y: 0, rotation: 0 };
            const newPiece = rotate(board, piece);

            expect(newPiece.rotation).toBe(1);
        });
    });

    describe('hardDrop()', () => {
        test('should drop piece to bottom of empty board', () => {
            const piece = { type: 'I', x: 3, y: 0, rotation: 0 };
            const droppedPiece = hardDrop(board, piece);

            // Pièce I horizontale rotation 0: [[0,1], [1,1], [2,1], [3,1]]
            // Elle occupe la ligne y+1, donc tombe à y=18 (ligne 19 du board)
            expect(droppedPiece.x).toBe(3);
            expect(droppedPiece.y).toBe(18);
        });

        test('should drop piece until it hits existing piece', () => {
            // Placer un obstacle à y=15
            for (let x = 0; x < 10; x++) {
                board[15][x] = 'I';
            }

            const piece = { type: 'I', x: 3, y: 0, rotation: 0 };
            const droppedPiece = hardDrop(board, piece);

            // Pièce I rotation 0 occupe y+1
            // L'obstacle est à y=15, donc la pièce s'arrête à y=13 (ligne y+1=14)
            expect(droppedPiece.y).toBe(13);
        });

        test('should not move if already at bottom', () => {
            const piece = { type: 'I', x: 3, y: 19, rotation: 0 };
            const droppedPiece = hardDrop(board, piece);

            expect(droppedPiece.y).toBe(19);
        });

        test('should work with vertical piece', () => {
            const piece = { type: 'I', x: 5, y: 0, rotation: 1 }; // I vertical
            const droppedPiece = hardDrop(board, piece);

            // Pièce I verticale: [[2,0], [2,1], [2,2], [2,3]]
            // Devrait tomber à y=16 (car elle occupe 4 lignes: 16,17,18,19)
            expect(droppedPiece.y).toBe(16);
        });

        test('should drop piece with complex shape', () => {
            const piece = { type: 'T', x: 4, y: 0, rotation: 0 };
            const droppedPiece = hardDrop(board, piece);

            // Devrait tomber jusqu'en bas
            expect(droppedPiece.y).toBeGreaterThan(0);
        });

        test('should handle piece landing on irregular surface', () => {
            // Créer une surface irrégulière
            board[18][3] = 'I';
            board[18][4] = 'I';
            board[18][5] = 'I';
            board[19][6] = 'I';

            const piece = { type: 'I', x: 3, y: 0, rotation: 0 };
            const droppedPiece = hardDrop(board, piece);

            // Pièce I rotation 0 occupe y+1
            // Obstacles à y=18 pour x=3,4,5,6 donc s'arrête à y=16 (ligne y+1=17)
            expect(droppedPiece.y).toBe(16);
        });
    });
});
