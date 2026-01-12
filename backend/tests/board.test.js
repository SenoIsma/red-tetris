import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    createEmptyBoard,
    canPlacePiece,
    placePiece,
    clearLines,
    calculateSpectrum
} from '../src/utils/board.js';

describe('board.js', () => {

    describe('createEmptyBoard()', () => {
        test('should create a board with correct dimensions', () => {
            const board = createEmptyBoard();

            expect(board.length).toBe(BOARD_HEIGHT);
            expect(board[0].length).toBe(BOARD_WIDTH);

            // Vérifier que toutes les cellules sont à 0
            board.forEach(row => {
                row.forEach(cell => {
                    expect(cell).toBe(0);
                });
            });
        });
    });

    describe('canPlacePiece()', () => {
        let board;

        beforeEach(() => {
            board = createEmptyBoard();
        });

        test('should return true for valid placement', () => {
            const piece = [[0, 0], [1, 0], [2, 0], [3, 0]]; // Pièce I horizontale
            const result = canPlacePiece(board, piece, 3, 0);

            expect(result).toBe(true);
        });

        test('should return false if piece goes left of board', () => {
            const piece = [[0, 0], [1, 0], [2, 0], [3, 0]]; // Pièce I horizontale
            const result = canPlacePiece(board, piece, -1, 0); // x=-1, donc bloc[0]=0 -> absX=-1

            expect(result).toBe(false);
        });

        test('should return false if piece goes right of board', () => {
            const piece = [[0, 0], [1, 0], [2, 0], [3, 0]]; // Pièce I horizontale
            const result = canPlacePiece(board, piece, 8, 0); // x=8, bloc[0]=3 -> absX=11 >= BOARD_WIDTH

            expect(result).toBe(false);
        });

        test('should return false if piece goes above board', () => {
            const piece = [[0, 0], [0, 1], [0, 2], [0, 3]]; // Pièce I verticale
            const result = canPlacePiece(board, piece, 5, -1); // y=-1

            expect(result).toBe(false);
        });

        test('should return false if piece goes below board', () => {
            const piece = [[0, 0], [0, 1], [0, 2], [0, 3]]; // Pièce I verticale
            const result = canPlacePiece(board, piece, 5, 18); // y=18, bloc[1]=3 -> absY=21 >= BOARD_HEIGHT

            expect(result).toBe(false);
        });

        test('should return false if piece overlaps existing piece', () => {
            // Placer une pièce existante
            board[0][5] = 'I';

            const piece = [[0, 0], [1, 0], [2, 0]];
            const result = canPlacePiece(board, piece, 5, 0); // Chevauchement à (5,0)

            expect(result).toBe(false);
        });
    });

    describe('placePiece()', () => {
        let board;

        beforeEach(() => {
            board = createEmptyBoard();
        });

        test('should place piece on board', () => {
            const piece = [[0, 0], [1, 0], [2, 0], [3, 0]]; // Pièce I horizontale
            const newBoard = placePiece(board, piece, 3, 5, 'I');

            expect(newBoard[5][3]).toBe('I');
            expect(newBoard[5][4]).toBe('I');
            expect(newBoard[5][5]).toBe('I');
            expect(newBoard[5][6]).toBe('I');

            // Vérifier que l'original n'a pas changé
            expect(board[5][3]).toBe(0);
        });

        test('should not modify original board', () => {
            const piece = [[0, 0], [1, 0]];
            const originalBoard = createEmptyBoard();
            const newBoard = placePiece(originalBoard, piece, 5, 5, 'I');

            expect(originalBoard[5][5]).toBe(0);
            expect(newBoard[5][5]).toBe('I');
        });
    });

    describe('clearLines()', () => {
        test('should clear no lines on empty board', () => {
            const board = createEmptyBoard();
            const result = clearLines(board);

            expect(result.linesCleared).toBe(0);
            expect(result.board.length).toBe(BOARD_HEIGHT);
        });

        test('should clear one full line', () => {
            const board = createEmptyBoard();
            // Remplir la dernière ligne
            for (let x = 0; x < BOARD_WIDTH; x++) {
                board[19][x] = 'I';
            }

            const result = clearLines(board);

            expect(result.linesCleared).toBe(1);
            expect(result.board.length).toBe(BOARD_HEIGHT);

            // Vérifier que la dernière ligne est vide maintenant
            expect(result.board[19].every(cell => cell === 0)).toBe(true);

            // Vérifier qu'une nouvelle ligne vide a été ajoutée en haut
            expect(result.board[0].every(cell => cell === 0)).toBe(true);
        });

        test('should clear multiple full lines', () => {
            const board = createEmptyBoard();
            // Remplir les lignes 18 et 19
            for (let x = 0; x < BOARD_WIDTH; x++) {
                board[18][x] = 'I';
                board[19][x] = 'J';
            }

            const result = clearLines(board);

            expect(result.linesCleared).toBe(2);
            expect(result.board.length).toBe(BOARD_HEIGHT);

            // Vérifier que les deux dernières lignes sont vides
            expect(result.board[18].every(cell => cell === 0)).toBe(true);
            expect(result.board[19].every(cell => cell === 0)).toBe(true);
        });

        test('should not clear partial lines', () => {
            const board = createEmptyBoard();
            // Remplir la dernière ligne sauf une cellule
            for (let x = 0; x < BOARD_WIDTH - 1; x++) {
                board[19][x] = 'I';
            }

            const result = clearLines(board);

            expect(result.linesCleared).toBe(0);
        });

        test('should maintain board height after clearing', () => {
            const board = createEmptyBoard();
            // Remplir 4 lignes
            for (let y = 16; y < 20; y++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    board[y][x] = 'I';
                }
            }

            const result = clearLines(board);

            expect(result.linesCleared).toBe(4);
            expect(result.board.length).toBe(BOARD_HEIGHT);

            // Vérifier que les 4 premières lignes sont vides
            for (let y = 0; y < 4; y++) {
                expect(result.board[y].every(cell => cell === 0)).toBe(true);
            }
        });
    });

    describe('calculateSpectrum()', () => {
        test('should return all zeros for empty board', () => {
            const board = createEmptyBoard();
            const spectrum = calculateSpectrum(board);

            expect(spectrum.length).toBe(BOARD_WIDTH);
            expect(spectrum.every(height => height === 0)).toBe(true);
        });

        test('should calculate correct heights for single column', () => {
            const board = createEmptyBoard();
            // Placer des blocs dans la colonne 5
            board[15][5] = 'I';
            board[16][5] = 'I';
            board[17][5] = 'I';

            const spectrum = calculateSpectrum(board);

            // Hauteur = BOARD_HEIGHT - row = 20 - 15 = 5
            expect(spectrum[5]).toBe(5);
            // Les autres colonnes devraient être à 0
            expect(spectrum[0]).toBe(0);
            expect(spectrum[9]).toBe(0);
        });

        test('should calculate correct heights for multiple columns', () => {
            const board = createEmptyBoard();
            // Colonne 0: un bloc à la ligne 19
            board[19][0] = 'I';
            // Colonne 5: un bloc à la ligne 10
            board[10][5] = 'J';
            // Colonne 9: un bloc à la ligne 5
            board[5][9] = 'L';

            const spectrum = calculateSpectrum(board);

            expect(spectrum[0]).toBe(1);  // 20 - 19 = 1
            expect(spectrum[5]).toBe(10); // 20 - 10 = 10
            expect(spectrum[9]).toBe(15); // 20 - 5 = 15
        });

        test('should find highest block in each column', () => {
            const board = createEmptyBoard();
            // Colonne 3: plusieurs blocs, le plus haut à la ligne 5
            board[5][3] = 'I';
            board[10][3] = 'I';
            board[15][3] = 'I';

            const spectrum = calculateSpectrum(board);

            // Devrait prendre le plus haut (ligne 5)
            expect(spectrum[3]).toBe(15); // 20 - 5 = 15
        });

        test('should handle full columns', () => {
            const board = createEmptyBoard();
            // Remplir complètement la colonne 2
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                board[y][2] = 'I';
            }

            const spectrum = calculateSpectrum(board);

            expect(spectrum[2]).toBe(20); // 20 - 0 = 20
        });

        test('should handle complex board state', () => {
            const board = createEmptyBoard();
            // Créer un pattern irrégulier
            board[18][0] = 'I';
            board[15][1] = 'J';
            board[19][2] = 'L';
            board[10][3] = 'T';
            board[5][4] = 'S';

            const spectrum = calculateSpectrum(board);

            expect(spectrum[0]).toBe(2);  // 20 - 18 = 2
            expect(spectrum[1]).toBe(5);  // 20 - 15 = 5
            expect(spectrum[2]).toBe(1);  // 20 - 19 = 1
            expect(spectrum[3]).toBe(10); // 20 - 10 = 10
            expect(spectrum[4]).toBe(15); // 20 - 5 = 15
            expect(spectrum[5]).toBe(0);  // Pas de bloc
        });
    });
});
