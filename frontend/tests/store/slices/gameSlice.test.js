import { describe, test, expect } from '@jest/globals';
import gameReducer, {
  setRoomName,
  setPlayers,
  setHostId,
  setGameStatus,
  setWinner,
  setCurrentPiece,
  setNextPiece,
  addPenaltyLines,
  clearPenaltyLines
} from '../../../src/store/slices/gameSlice.js';

describe('gameSlice', () => {
  const initialState = {
    roomName: "",
    players: [],
    hostId: null,
    gameStatus: 'waiting',
    winner: null,
    currentPiece: null,
    nextPiece: null,
    pendingPenaltyLines: 0
  };

  describe('initial state', () => {
    test('should return the initial state', () => {
      expect(gameReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('setRoomName', () => {
    test('should set room name', () => {
      const state = gameReducer(initialState, setRoomName('room1'));
      expect(state.roomName).toBe('room1');
    });

    test('should update room name', () => {
      const previousState = { ...initialState, roomName: 'oldRoom' };
      const state = gameReducer(previousState, setRoomName('newRoom'));
      expect(state.roomName).toBe('newRoom');
    });

    test('should handle empty string', () => {
      const state = gameReducer(initialState, setRoomName(''));
      expect(state.roomName).toBe('');
    });
  });

  describe('setPlayers', () => {
    test('should set players array', () => {
      const players = [
        { id: '1', name: 'Player1' },
        { id: '2', name: 'Player2' }
      ];
      const state = gameReducer(initialState, setPlayers(players));
      expect(state.players).toEqual(players);
    });

    test('should update players array', () => {
      const previousState = { ...initialState, players: [{ id: '1', name: 'Player1' }] };
      const newPlayers = [{ id: '2', name: 'Player2' }];
      const state = gameReducer(previousState, setPlayers(newPlayers));
      expect(state.players).toEqual(newPlayers);
    });

    test('should handle empty array', () => {
      const state = gameReducer(initialState, setPlayers([]));
      expect(state.players).toEqual([]);
    });
  });

  describe('setHostId', () => {
    test('should set host id', () => {
      const state = gameReducer(initialState, setHostId('host123'));
      expect(state.hostId).toBe('host123');
    });

    test('should update host id', () => {
      const previousState = { ...initialState, hostId: 'oldHost' };
      const state = gameReducer(previousState, setHostId('newHost'));
      expect(state.hostId).toBe('newHost');
    });

    test('should handle null value', () => {
      const previousState = { ...initialState, hostId: 'host123' };
      const state = gameReducer(previousState, setHostId(null));
      expect(state.hostId).toBeNull();
    });
  });

  describe('setGameStatus', () => {
    test('should set game status', () => {
      const state = gameReducer(initialState, setGameStatus('playing'));
      expect(state.gameStatus).toBe('playing');
    });

    test('should reset game state when transitioning from waiting to playing', () => {
      const previousState = {
        ...initialState,
        gameStatus: 'waiting',
        winner: 'Player1',
        currentPiece: { type: 'I' },
        nextPiece: { type: 'O' },
        pendingPenaltyLines: 5
      };
      const state = gameReducer(previousState, setGameStatus('playing'));

      expect(state.gameStatus).toBe('playing');
      expect(state.winner).toBeNull();
      expect(state.currentPiece).toBeNull();
      expect(state.nextPiece).toBeNull();
      expect(state.pendingPenaltyLines).toBe(0);
    });

    test('should reset pieces when transitioning from playing to waiting', () => {
      const previousState = {
        ...initialState,
        gameStatus: 'playing',
        currentPiece: { type: 'I' },
        nextPiece: { type: 'O' },
        pendingPenaltyLines: 3
      };
      const state = gameReducer(previousState, setGameStatus('waiting'));

      expect(state.gameStatus).toBe('waiting');
      expect(state.currentPiece).toBeNull();
      expect(state.nextPiece).toBeNull();
      expect(state.pendingPenaltyLines).toBe(0);
    });

    test('should reset pieces when transitioning from finished to waiting', () => {
      const previousState = {
        ...initialState,
        gameStatus: 'finished',
        currentPiece: { type: 'I' },
        nextPiece: { type: 'O' },
        pendingPenaltyLines: 2
      };
      const state = gameReducer(previousState, setGameStatus('waiting'));

      expect(state.gameStatus).toBe('waiting');
      expect(state.currentPiece).toBeNull();
      expect(state.nextPiece).toBeNull();
      expect(state.pendingPenaltyLines).toBe(0);
    });

    test('should not reset state on other transitions', () => {
      const previousState = {
        ...initialState,
        gameStatus: 'playing',
        winner: 'Player1',
        currentPiece: { type: 'I' },
        nextPiece: { type: 'O' },
        pendingPenaltyLines: 4
      };
      const state = gameReducer(previousState, setGameStatus('finished'));

      expect(state.gameStatus).toBe('finished');
      expect(state.winner).toBe('Player1');
      expect(state.currentPiece).toEqual({ type: 'I' });
      expect(state.nextPiece).toEqual({ type: 'O' });
      expect(state.pendingPenaltyLines).toBe(4);
    });
  });

  describe('setWinner', () => {
    test('should set winner', () => {
      const state = gameReducer(initialState, setWinner('Player1'));
      expect(state.winner).toBe('Player1');
    });

    test('should update winner', () => {
      const previousState = { ...initialState, winner: 'Player1' };
      const state = gameReducer(previousState, setWinner('Player2'));
      expect(state.winner).toBe('Player2');
    });

    test('should handle null value', () => {
      const previousState = { ...initialState, winner: 'Player1' };
      const state = gameReducer(previousState, setWinner(null));
      expect(state.winner).toBeNull();
    });
  });

  describe('setCurrentPiece', () => {
    test('should set current piece', () => {
      const piece = { type: 'I', rotation: 0, x: 3, y: 0 };
      const state = gameReducer(initialState, setCurrentPiece(piece));
      expect(state.currentPiece).toEqual(piece);
    });

    test('should update current piece', () => {
      const previousState = { ...initialState, currentPiece: { type: 'I' } };
      const newPiece = { type: 'O', rotation: 0, x: 4, y: 0 };
      const state = gameReducer(previousState, setCurrentPiece(newPiece));
      expect(state.currentPiece).toEqual(newPiece);
    });

    test('should handle null value', () => {
      const previousState = { ...initialState, currentPiece: { type: 'I' } };
      const state = gameReducer(previousState, setCurrentPiece(null));
      expect(state.currentPiece).toBeNull();
    });
  });

  describe('setNextPiece', () => {
    test('should set next piece', () => {
      const piece = { type: 'T', rotation: 0, x: 3, y: 0 };
      const state = gameReducer(initialState, setNextPiece(piece));
      expect(state.nextPiece).toEqual(piece);
    });

    test('should update next piece', () => {
      const previousState = { ...initialState, nextPiece: { type: 'T' } };
      const newPiece = { type: 'Z', rotation: 0, x: 3, y: 0 };
      const state = gameReducer(previousState, setNextPiece(newPiece));
      expect(state.nextPiece).toEqual(newPiece);
    });

    test('should handle null value', () => {
      const previousState = { ...initialState, nextPiece: { type: 'T' } };
      const state = gameReducer(previousState, setNextPiece(null));
      expect(state.nextPiece).toBeNull();
    });
  });

  describe('addPenaltyLines', () => {
    test('should add penalty lines', () => {
      const state = gameReducer(initialState, addPenaltyLines(2));
      expect(state.pendingPenaltyLines).toBe(2);
    });

    test('should accumulate penalty lines', () => {
      let state = gameReducer(initialState, addPenaltyLines(2));
      state = gameReducer(state, addPenaltyLines(3));
      expect(state.pendingPenaltyLines).toBe(5);
    });

    test('should handle zero penalty lines', () => {
      const state = gameReducer(initialState, addPenaltyLines(0));
      expect(state.pendingPenaltyLines).toBe(0);
    });

    test('should handle negative penalty lines', () => {
      const previousState = { ...initialState, pendingPenaltyLines: 5 };
      const state = gameReducer(previousState, addPenaltyLines(-2));
      expect(state.pendingPenaltyLines).toBe(3);
    });
  });

  describe('clearPenaltyLines', () => {
    test('should clear penalty lines', () => {
      const previousState = { ...initialState, pendingPenaltyLines: 5 };
      const state = gameReducer(previousState, clearPenaltyLines());
      expect(state.pendingPenaltyLines).toBe(0);
    });

    test('should handle already zero penalty lines', () => {
      const state = gameReducer(initialState, clearPenaltyLines());
      expect(state.pendingPenaltyLines).toBe(0);
    });
  });

  describe('multiple actions', () => {
    test('should handle multiple actions in sequence', () => {
      let state = initialState;

      state = gameReducer(state, setRoomName('testRoom'));
      state = gameReducer(state, setPlayers([{ id: '1', name: 'Player1' }]));
      state = gameReducer(state, setHostId('1'));
      state = gameReducer(state, setGameStatus('playing'));
      state = gameReducer(state, setCurrentPiece({ type: 'I' }));
      state = gameReducer(state, addPenaltyLines(3));

      expect(state.roomName).toBe('testRoom');
      expect(state.players).toHaveLength(1);
      expect(state.hostId).toBe('1');
      expect(state.gameStatus).toBe('playing');
      expect(state.currentPiece).toEqual({ type: 'I' });
      expect(state.pendingPenaltyLines).toBe(3);
    });
  });
});
