import { describe, test, expect } from '@jest/globals';
import { placePiece } from '../../src/utils/board.js';

describe('board.js - Pure functions', () => {

  describe('placePiece', () => {
    let board;

    const createEmptyBoard = () => {
      return Array(20).fill(0).map(() => Array(10).fill(0));
    };

    test('should place piece at correct coordinates', () => {
      board = createEmptyBoard();
      const piece = [[0, 0], [1, 0], [2, 0]];
      const newBoard = placePiece(board, piece, 3, 5, 'I');

      expect(newBoard[5][3]).toBe('I');
      expect(newBoard[5][4]).toBe('I');
      expect(newBoard[5][5]).toBe('I');
    });

    test('should not mutate original board (pure function)', () => {
      board = createEmptyBoard();
      const piece = [[0, 0], [1, 0]];
      const originalBoard = createEmptyBoard();
      const newBoard = placePiece(originalBoard, piece, 3, 5, 'O');

      expect(originalBoard[5][3]).toBe(0);
      expect(newBoard[5][3]).toBe('O');
    });

    test('should place O piece (2x2 square)', () => {
      board = createEmptyBoard();
      const piece = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const newBoard = placePiece(board, piece, 4, 8, 'O');

      expect(newBoard[8][4]).toBe('O');
      expect(newBoard[8][5]).toBe('O');
      expect(newBoard[9][4]).toBe('O');
      expect(newBoard[9][5]).toBe('O');
    });

    test('should place piece with correct piece type', () => {
      board = createEmptyBoard();
      const piece = [[0, 0]];
      const newBoard = placePiece(board, piece, 5, 10, 'T');

      expect(newBoard[10][5]).toBe('T');
    });

    test('should place I piece (horizontal)', () => {
      board = createEmptyBoard();
      const piece = [[0, 0], [1, 0], [2, 0], [3, 0]];
      const newBoard = placePiece(board, piece, 3, 0, 'I');

      expect(newBoard[0][3]).toBe('I');
      expect(newBoard[0][4]).toBe('I');
      expect(newBoard[0][5]).toBe('I');
      expect(newBoard[0][6]).toBe('I');
    });

    test('should place I piece (vertical)', () => {
      board = createEmptyBoard();
      const piece = [[0, 0], [0, 1], [0, 2], [0, 3]];
      const newBoard = placePiece(board, piece, 5, 10, 'I');

      expect(newBoard[10][5]).toBe('I');
      expect(newBoard[11][5]).toBe('I');
      expect(newBoard[12][5]).toBe('I');
      expect(newBoard[13][5]).toBe('I');
    });

    test('should place T piece', () => {
      board = createEmptyBoard();
      const piece = [[0, 1], [1, 1], [1, 0], [2, 1]];
      const newBoard = placePiece(board, piece, 3, 5, 'T');

      expect(newBoard[6][3]).toBe('T');
      expect(newBoard[6][4]).toBe('T');
      expect(newBoard[5][4]).toBe('T');
      expect(newBoard[6][5]).toBe('T');
    });

    test('should place J piece', () => {
      board = createEmptyBoard();
      const piece = [[0, 0], [0, 1], [1, 1], [2, 1]];
      const newBoard = placePiece(board, piece, 2, 8, 'J');

      expect(newBoard[8][2]).toBe('J');
      expect(newBoard[9][2]).toBe('J');
      expect(newBoard[9][3]).toBe('J');
      expect(newBoard[9][4]).toBe('J');
    });

    test('should place L piece', () => {
      board = createEmptyBoard();
      const piece = [[0, 1], [1, 1], [2, 1], [2, 0]];
      const newBoard = placePiece(board, piece, 1, 7, 'L');

      expect(newBoard[8][1]).toBe('L');
      expect(newBoard[8][2]).toBe('L');
      expect(newBoard[8][3]).toBe('L');
      expect(newBoard[7][3]).toBe('L');
    });

    test('should place S piece', () => {
      board = createEmptyBoard();
      const piece = [[0, 1], [1, 1], [1, 0], [2, 0]];
      const newBoard = placePiece(board, piece, 3, 10, 'S');

      expect(newBoard[11][3]).toBe('S');
      expect(newBoard[11][4]).toBe('S');
      expect(newBoard[10][4]).toBe('S');
      expect(newBoard[10][5]).toBe('S');
    });

    test('should place Z piece', () => {
      board = createEmptyBoard();
      const piece = [[0, 0], [1, 0], [1, 1], [2, 1]];
      const newBoard = placePiece(board, piece, 2, 5, 'Z');

      expect(newBoard[5][2]).toBe('Z');
      expect(newBoard[5][3]).toBe('Z');
      expect(newBoard[6][3]).toBe('Z');
      expect(newBoard[6][4]).toBe('Z');
    });

    test('should place piece on partially filled board', () => {
      board = createEmptyBoard();
      board[19][0] = 'T';
      board[19][1] = 'T';

      const piece = [[0, 0], [1, 0]];
      const newBoard = placePiece(board, piece, 5, 19, 'I');

      expect(newBoard[19][0]).toBe('T');
      expect(newBoard[19][1]).toBe('T');
      expect(newBoard[19][5]).toBe('I');
      expect(newBoard[19][6]).toBe('I');
    });

    test('should handle piece placement at board edges', () => {
      board = createEmptyBoard();
      const piece = [[0, 0]];

      // Top-left corner
      let newBoard = placePiece(board, piece, 0, 0, 'I');
      expect(newBoard[0][0]).toBe('I');

      // Top-right corner
      newBoard = placePiece(board, piece, 9, 0, 'O');
      expect(newBoard[0][9]).toBe('O');

      // Bottom-left corner
      newBoard = placePiece(board, piece, 0, 19, 'T');
      expect(newBoard[19][0]).toBe('T');

      // Bottom-right corner
      newBoard = placePiece(board, piece, 9, 19, 'J');
      expect(newBoard[19][9]).toBe('J');
    });

    test('should not affect other cells', () => {
      board = createEmptyBoard();
      const piece = [[0, 0]];
      const newBoard = placePiece(board, piece, 5, 10, 'I');

      // Check that only the target cell was modified
      let modifiedCells = 0;
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          if (newBoard[y][x] !== 0) {
            modifiedCells++;
          }
        }
      }

      expect(modifiedCells).toBe(1);
      expect(newBoard[10][5]).toBe('I');
    });

    test('should place PENALTY type', () => {
      board = createEmptyBoard();
      const piece = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]];
      const newBoard = placePiece(board, piece, 0, 19, 'PENALTY');

      for (let x = 0; x < 10; x++) {
        expect(newBoard[19][x]).toBe('PENALTY');
      }
    });
  });
});
