import { describe, test, expect } from '@jest/globals';
import boardReducer, {
  setGrid,
  setCurrentPiece,
  setCurrentPosition,
  setNextPiece
} from '../../../src/store/slices/boardSlice.js';

describe('boardSlice', () => {
  const initialState = {
    grid: [],
    currentPiece: null,
    currentPosition: { x: 0, y: 0 },
    nextPiece: null
  };

  describe('initial state', () => {
    test('should return the initial state', () => {
      expect(boardReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('setGrid', () => {
    test('should set grid', () => {
      const grid = Array(20).fill(0).map(() => Array(10).fill(0));
      const state = boardReducer(initialState, setGrid(grid));
      expect(state.grid).toEqual(grid);
    });

    test('should update grid', () => {
      const oldGrid = [[0, 0, 0], [0, 0, 0]];
      const previousState = { ...initialState, grid: oldGrid };
      const newGrid = [[1, 1, 1], [1, 1, 1]];
      const state = boardReducer(previousState, setGrid(newGrid));
      expect(state.grid).toEqual(newGrid);
    });

    test('should handle empty array', () => {
      const previousState = { ...initialState, grid: [[1, 2], [3, 4]] };
      const state = boardReducer(previousState, setGrid([]));
      expect(state.grid).toEqual([]);
    });

    test('should handle grid with pieces', () => {
      const grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ['I', 'I', 'I', 'I', 0, 0, 0, 0, 0, 0]
      ];
      const state = boardReducer(initialState, setGrid(grid));
      expect(state.grid).toEqual(grid);
    });

    test('should handle full grid', () => {
      const grid = Array(20).fill(0).map(() => Array(10).fill('I'));
      const state = boardReducer(initialState, setGrid(grid));
      expect(state.grid).toEqual(grid);
    });
  });

  describe('setCurrentPiece', () => {
    test('should set current piece', () => {
      const piece = { type: 'I', rotation: 0, x: 3, y: 0 };
      const state = boardReducer(initialState, setCurrentPiece(piece));
      expect(state.currentPiece).toEqual(piece);
    });

    test('should update current piece', () => {
      const previousState = { ...initialState, currentPiece: { type: 'I' } };
      const newPiece = { type: 'O', rotation: 0, x: 4, y: 0 };
      const state = boardReducer(previousState, setCurrentPiece(newPiece));
      expect(state.currentPiece).toEqual(newPiece);
    });

    test('should handle null value', () => {
      const previousState = { ...initialState, currentPiece: { type: 'I' } };
      const state = boardReducer(previousState, setCurrentPiece(null));
      expect(state.currentPiece).toBeNull();
    });

    test('should handle all piece types', () => {
      const pieceTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

      pieceTypes.forEach(type => {
        const piece = { type, rotation: 0, x: 3, y: 0 };
        const state = boardReducer(initialState, setCurrentPiece(piece));
        expect(state.currentPiece.type).toBe(type);
      });
    });
  });

  describe('setCurrentPosition', () => {
    test('should set current position', () => {
      const position = { x: 5, y: 10 };
      const state = boardReducer(initialState, setCurrentPosition(position));
      expect(state.currentPosition).toEqual(position);
    });

    test('should update current position', () => {
      const previousState = { ...initialState, currentPosition: { x: 0, y: 0 } };
      const newPosition = { x: 7, y: 15 };
      const state = boardReducer(previousState, setCurrentPosition(newPosition));
      expect(state.currentPosition).toEqual(newPosition);
    });

    test('should handle position at origin', () => {
      const position = { x: 0, y: 0 };
      const state = boardReducer(initialState, setCurrentPosition(position));
      expect(state.currentPosition).toEqual(position);
    });

    test('should handle position at board edges', () => {
      const position = { x: 9, y: 19 };
      const state = boardReducer(initialState, setCurrentPosition(position));
      expect(state.currentPosition).toEqual(position);
    });

    test('should handle negative positions', () => {
      const position = { x: -1, y: -1 };
      const state = boardReducer(initialState, setCurrentPosition(position));
      expect(state.currentPosition).toEqual(position);
    });
  });

  describe('setNextPiece', () => {
    test('should set next piece', () => {
      const piece = { type: 'T', rotation: 0, x: 3, y: 0 };
      const state = boardReducer(initialState, setNextPiece(piece));
      expect(state.nextPiece).toEqual(piece);
    });

    test('should update next piece', () => {
      const previousState = { ...initialState, nextPiece: { type: 'T' } };
      const newPiece = { type: 'Z', rotation: 0, x: 3, y: 0 };
      const state = boardReducer(previousState, setNextPiece(newPiece));
      expect(state.nextPiece).toEqual(newPiece);
    });

    test('should handle null value', () => {
      const previousState = { ...initialState, nextPiece: { type: 'T' } };
      const state = boardReducer(previousState, setNextPiece(null));
      expect(state.nextPiece).toBeNull();
    });

    test('should handle all piece types', () => {
      const pieceTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

      pieceTypes.forEach(type => {
        const piece = { type, rotation: 0, x: 3, y: 0 };
        const state = boardReducer(initialState, setNextPiece(piece));
        expect(state.nextPiece.type).toBe(type);
      });
    });
  });

  describe('multiple actions', () => {
    test('should handle multiple actions in sequence', () => {
      const grid = Array(20).fill(0).map(() => Array(10).fill(0));
      const currentPiece = { type: 'I', rotation: 0, x: 3, y: 0 };
      const currentPosition = { x: 3, y: 5 };
      const nextPiece = { type: 'O', rotation: 0, x: 3, y: 0 };

      let state = initialState;
      state = boardReducer(state, setGrid(grid));
      state = boardReducer(state, setCurrentPiece(currentPiece));
      state = boardReducer(state, setCurrentPosition(currentPosition));
      state = boardReducer(state, setNextPiece(nextPiece));

      expect(state.grid).toEqual(grid);
      expect(state.currentPiece).toEqual(currentPiece);
      expect(state.currentPosition).toEqual(currentPosition);
      expect(state.nextPiece).toEqual(nextPiece);
    });

    test('should handle piece movement', () => {
      let state = {
        ...initialState,
        currentPiece: { type: 'I', rotation: 0, x: 3, y: 0 },
        currentPosition: { x: 3, y: 0 }
      };

      state = boardReducer(state, setCurrentPosition({ x: 4, y: 0 }));
      expect(state.currentPosition).toEqual({ x: 4, y: 0 });

      state = boardReducer(state, setCurrentPosition({ x: 4, y: 1 }));
      expect(state.currentPosition).toEqual({ x: 4, y: 1 });

      state = boardReducer(state, setCurrentPosition({ x: 4, y: 2 }));
      expect(state.currentPosition).toEqual({ x: 4, y: 2 });
    });

    test('should handle piece locking and spawning new piece', () => {
      const grid = Array(20).fill(0).map(() => Array(10).fill(0));
      grid[19] = ['I', 'I', 'I', 'I', 0, 0, 0, 0, 0, 0];

      let state = {
        ...initialState,
        currentPiece: { type: 'I', rotation: 0, x: 0, y: 19 },
        nextPiece: { type: 'O', rotation: 0, x: 3, y: 0 }
      };

      state = boardReducer(state, setGrid(grid));
      state = boardReducer(state, setCurrentPiece(state.nextPiece));
      state = boardReducer(state, setCurrentPosition({ x: 3, y: 0 }));
      state = boardReducer(state, setNextPiece({ type: 'T', rotation: 0, x: 3, y: 0 }));

      expect(state.grid[19]).toEqual(['I', 'I', 'I', 'I', 0, 0, 0, 0, 0, 0]);
      expect(state.currentPiece.type).toBe('O');
      expect(state.nextPiece.type).toBe('T');
    });
  });

  describe('state immutability', () => {
    test('should not mutate previous state when setting grid', () => {
      const previousGrid = [[0, 0], [0, 0]];
      const previousState = { ...initialState, grid: previousGrid };
      const stateCopy = { ...previousState, grid: previousGrid.map(row => [...row]) };

      boardReducer(previousState, setGrid([[1, 1], [1, 1]]));

      expect(previousState.grid).toEqual(stateCopy.grid);
    });

    test('should not mutate previous state when setting current piece', () => {
      const previousPiece = { type: 'I', rotation: 0, x: 3, y: 0 };
      const previousState = { ...initialState, currentPiece: previousPiece };
      const stateCopy = { ...previousState, currentPiece: { ...previousPiece } };

      boardReducer(previousState, setCurrentPiece({ type: 'O', rotation: 0, x: 4, y: 0 }));

      expect(previousState.currentPiece).toEqual(stateCopy.currentPiece);
    });
  });
});
