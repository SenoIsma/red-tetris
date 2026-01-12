import { describe, test, expect } from '@jest/globals';
import { SHAPES, COLORS, getPieceColor, getShape } from '../../src/utils/pieces.js';

describe('pieces.js - Pure functions', () => {

  describe('SHAPES constant', () => {
    test('should have all 7 tetrimino types', () => {
      const types = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];

      types.forEach(type => {
        expect(SHAPES[type]).toBeDefined();
      });
    });

    test('should have 4 rotations for each piece', () => {
      const types = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];

      types.forEach(type => {
        expect(SHAPES[type]).toHaveLength(4);
      });
    });

    test('should have 4 blocks for each rotation', () => {
      const types = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];

      types.forEach(type => {
        SHAPES[type].forEach(rotation => {
          expect(rotation).toHaveLength(4);
        });
      });
    });

    test('each block should have [x, y] coordinates', () => {
      const types = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];

      types.forEach(type => {
        SHAPES[type].forEach(rotation => {
          rotation.forEach(block => {
            expect(block).toHaveLength(2);
            expect(typeof block[0]).toBe('number');
            expect(typeof block[1]).toBe('number');
          });
        });
      });
    });

    test('O piece should be identical in all rotations (square)', () => {
      const firstRotation = JSON.stringify(SHAPES.O[0]);

      SHAPES.O.forEach(rotation => {
        expect(JSON.stringify(rotation)).toBe(firstRotation);
      });
    });

    test('I piece should have correct shapes', () => {
      expect(SHAPES.I[0]).toEqual([[0,1], [1,1], [2,1], [3,1]]);
      expect(SHAPES.I[1]).toEqual([[2,0], [2,1], [2,2], [2,3]]);
      expect(SHAPES.I[2]).toEqual([[0,2], [1,2], [2,2], [3,2]]);
      expect(SHAPES.I[3]).toEqual([[1,0], [1,1], [1,2], [1,3]]);
    });

    test('O piece should have correct shape', () => {
      const expectedShape = [[1,0], [2,0], [1,1], [2,1]];
      SHAPES.O.forEach(rotation => {
        expect(rotation).toEqual(expectedShape);
      });
    });

    test('T piece should have correct shapes', () => {
      expect(SHAPES.T[0]).toEqual([[0,1], [1,1], [1,0], [2,1]]);
      expect(SHAPES.T[1]).toEqual([[1,2], [1,1], [1,0], [2,1]]);
      expect(SHAPES.T[2]).toEqual([[0,1], [1,1], [1,2], [2,1]]);
      expect(SHAPES.T[3]).toEqual([[0,1], [1,1], [1,0], [1,2]]);
    });
  });

  describe('COLORS constant', () => {
    test('should have colors for all 7 tetrimino types', () => {
      const types = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];

      types.forEach(type => {
        expect(COLORS[type]).toBeDefined();
        expect(typeof COLORS[type]).toBe('string');
      });
    });

    test('should have correct color values', () => {
      expect(COLORS.I).toBe('cyan');
      expect(COLORS.O).toBe('yellow');
      expect(COLORS.T).toBe('purple');
      expect(COLORS.S).toBe('green');
      expect(COLORS.Z).toBe('red');
      expect(COLORS.J).toBe('blue');
      expect(COLORS.L).toBe('orange');
    });

    test('should have penalty color', () => {
      expect(COLORS.PENALTY).toBe('gray');
    });
  });

  describe('getPieceColor', () => {
    test('should return correct color for I piece', () => {
      expect(getPieceColor('I')).toBe('cyan');
    });

    test('should return correct color for O piece', () => {
      expect(getPieceColor('O')).toBe('yellow');
    });

    test('should return correct color for T piece', () => {
      expect(getPieceColor('T')).toBe('purple');
    });

    test('should return correct color for S piece', () => {
      expect(getPieceColor('S')).toBe('green');
    });

    test('should return correct color for Z piece', () => {
      expect(getPieceColor('Z')).toBe('red');
    });

    test('should return correct color for J piece', () => {
      expect(getPieceColor('J')).toBe('blue');
    });

    test('should return correct color for L piece', () => {
      expect(getPieceColor('L')).toBe('orange');
    });

    test('should return correct color for penalty', () => {
      expect(getPieceColor('PENALTY')).toBe('gray');
    });

    test('should return undefined for invalid piece type', () => {
      expect(getPieceColor('INVALID')).toBeUndefined();
    });
  });

  describe('getShape', () => {
    test('should return correct shape for I piece rotation 0', () => {
      const piece = { type: 'I', rotation: 0, x: 3, y: 0 };
      const shape = getShape(piece);

      expect(shape).toEqual([[0,1], [1,1], [2,1], [3,1]]);
    });

    test('should return correct shape for I piece rotation 1', () => {
      const piece = { type: 'I', rotation: 1, x: 3, y: 0 };
      const shape = getShape(piece);

      expect(shape).toEqual([[2,0], [2,1], [2,2], [2,3]]);
    });

    test('should return correct shape for I piece rotation 2', () => {
      const piece = { type: 'I', rotation: 2, x: 3, y: 0 };
      const shape = getShape(piece);

      expect(shape).toEqual([[0,2], [1,2], [2,2], [3,2]]);
    });

    test('should return correct shape for I piece rotation 3', () => {
      const piece = { type: 'I', rotation: 3, x: 3, y: 0 };
      const shape = getShape(piece);

      expect(shape).toEqual([[1,0], [1,1], [1,2], [1,3]]);
    });

    test('should return same shape for O piece all rotations', () => {
      const expectedShape = [[1,0], [2,0], [1,1], [2,1]];

      for (let rotation = 0; rotation < 4; rotation++) {
        const piece = { type: 'O', rotation, x: 3, y: 0 };
        const shape = getShape(piece);

        expect(shape).toEqual(expectedShape);
      }
    });

    test('should return correct shape for T piece rotation 0', () => {
      const piece = { type: 'T', rotation: 0, x: 3, y: 0 };
      const shape = getShape(piece);

      expect(shape).toEqual([[0,1], [1,1], [1,0], [2,1]]);
    });

    test('should return correct shape for J piece rotation 0', () => {
      const piece = { type: 'J', rotation: 0, x: 3, y: 0 };
      const shape = getShape(piece);

      expect(shape).toEqual([[0,0], [0,1], [1,1], [2,1]]);
    });

    test('should return correct shape for L piece rotation 0', () => {
      const piece = { type: 'L', rotation: 0, x: 3, y: 0 };
      const shape = getShape(piece);

      expect(shape).toEqual([[0,1], [1,1], [2,1], [2,0]]);
    });

    test('should return correct shape for S piece rotation 0', () => {
      const piece = { type: 'S', rotation: 0, x: 3, y: 0 };
      const shape = getShape(piece);

      expect(shape).toEqual([[0,1], [1,1], [1,0], [2,0]]);
    });

    test('should return correct shape for Z piece rotation 0', () => {
      const piece = { type: 'Z', rotation: 0, x: 3, y: 0 };
      const shape = getShape(piece);

      expect(shape).toEqual([[0,0], [1,0], [1,1], [2,1]]);
    });

    test('should handle all rotations for all pieces', () => {
      const types = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];

      types.forEach(type => {
        for (let rotation = 0; rotation < 4; rotation++) {
          const piece = { type, rotation, x: 3, y: 0 };
          const shape = getShape(piece);

          expect(shape).toBeDefined();
          expect(Array.isArray(shape)).toBe(true);
          expect(shape).toHaveLength(4);
        }
      });
    });

    test('should not mutate piece object', () => {
      const piece = { type: 'I', rotation: 0, x: 3, y: 5 };
      const originalPiece = { ...piece };

      getShape(piece);

      expect(piece).toEqual(originalPiece);
    });
  });
});
