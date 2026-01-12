import { describe, test, expect } from '@jest/globals';
import playerReducer, {
  setPlayerName,
  setIsHost,
  setIsAlive,
  setSpectrum
} from '../../../src/store/slices/playerSlice.js';

describe('playerSlice', () => {
  const initialState = {
    name: "",
    isHost: false,
    isAlive: true,
    spectrum: []
  };

  describe('initial state', () => {
    test('should return the initial state', () => {
      expect(playerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('setPlayerName', () => {
    test('should set player name', () => {
      const state = playerReducer(initialState, setPlayerName('John'));
      expect(state.name).toBe('John');
    });

    test('should update player name', () => {
      const previousState = { ...initialState, name: 'OldName' };
      const state = playerReducer(previousState, setPlayerName('NewName'));
      expect(state.name).toBe('NewName');
    });

    test('should handle empty string', () => {
      const previousState = { ...initialState, name: 'John' };
      const state = playerReducer(previousState, setPlayerName(''));
      expect(state.name).toBe('');
    });

    test('should handle special characters', () => {
      const state = playerReducer(initialState, setPlayerName('Player_123'));
      expect(state.name).toBe('Player_123');
    });
  });

  describe('setIsHost', () => {
    test('should set isHost to true', () => {
      const state = playerReducer(initialState, setIsHost(true));
      expect(state.isHost).toBe(true);
    });

    test('should set isHost to false', () => {
      const previousState = { ...initialState, isHost: true };
      const state = playerReducer(previousState, setIsHost(false));
      expect(state.isHost).toBe(false);
    });

    test('should toggle isHost from false to true', () => {
      const state = playerReducer(initialState, setIsHost(true));
      expect(state.isHost).toBe(true);
    });

    test('should toggle isHost from true to false', () => {
      const previousState = { ...initialState, isHost: true };
      const state = playerReducer(previousState, setIsHost(false));
      expect(state.isHost).toBe(false);
    });
  });

  describe('setIsAlive', () => {
    test('should set isAlive to false', () => {
      const state = playerReducer(initialState, setIsAlive(false));
      expect(state.isAlive).toBe(false);
    });

    test('should set isAlive to true', () => {
      const previousState = { ...initialState, isAlive: false };
      const state = playerReducer(previousState, setIsAlive(true));
      expect(state.isAlive).toBe(true);
    });

    test('should toggle isAlive from true to false', () => {
      const state = playerReducer(initialState, setIsAlive(false));
      expect(state.isAlive).toBe(false);
    });

    test('should toggle isAlive from false to true', () => {
      const previousState = { ...initialState, isAlive: false };
      const state = playerReducer(previousState, setIsAlive(true));
      expect(state.isAlive).toBe(true);
    });
  });

  describe('setSpectrum', () => {
    test('should set spectrum array', () => {
      const spectrum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const state = playerReducer(initialState, setSpectrum(spectrum));
      expect(state.spectrum).toEqual(spectrum);
    });

    test('should update spectrum array', () => {
      const previousState = { ...initialState, spectrum: [0, 0, 0] };
      const newSpectrum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const state = playerReducer(previousState, setSpectrum(newSpectrum));
      expect(state.spectrum).toEqual(newSpectrum);
    });

    test('should handle empty array', () => {
      const previousState = { ...initialState, spectrum: [1, 2, 3] };
      const state = playerReducer(previousState, setSpectrum([]));
      expect(state.spectrum).toEqual([]);
    });

    test('should handle spectrum with zeros', () => {
      const spectrum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const state = playerReducer(initialState, setSpectrum(spectrum));
      expect(state.spectrum).toEqual(spectrum);
    });

    test('should handle spectrum with different heights', () => {
      const spectrum = [5, 3, 8, 2, 10, 1, 7, 4, 6, 9];
      const state = playerReducer(initialState, setSpectrum(spectrum));
      expect(state.spectrum).toEqual(spectrum);
    });
  });

  describe('multiple actions', () => {
    test('should handle multiple actions in sequence', () => {
      let state = initialState;

      state = playerReducer(state, setPlayerName('Alice'));
      state = playerReducer(state, setIsHost(true));
      state = playerReducer(state, setSpectrum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

      expect(state.name).toBe('Alice');
      expect(state.isHost).toBe(true);
      expect(state.isAlive).toBe(true);
      expect(state.spectrum).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    test('should handle player losing', () => {
      let state = { ...initialState, name: 'Bob', isHost: false };

      state = playerReducer(state, setIsAlive(false));

      expect(state.name).toBe('Bob');
      expect(state.isHost).toBe(false);
      expect(state.isAlive).toBe(false);
    });

    test('should handle player becoming host', () => {
      let state = { ...initialState, name: 'Charlie' };

      state = playerReducer(state, setIsHost(true));
      state = playerReducer(state, setSpectrum([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));

      expect(state.name).toBe('Charlie');
      expect(state.isHost).toBe(true);
      expect(state.spectrum).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe('state immutability', () => {
    test('should not mutate previous state when setting player name', () => {
      const previousState = { ...initialState, name: 'OldName' };
      const stateCopy = { ...previousState };

      playerReducer(previousState, setPlayerName('NewName'));

      expect(previousState).toEqual(stateCopy);
    });

    test('should not mutate previous state when setting spectrum', () => {
      const previousState = { ...initialState, spectrum: [1, 2, 3] };
      const stateCopy = { ...previousState, spectrum: [...previousState.spectrum] };

      playerReducer(previousState, setSpectrum([4, 5, 6]));

      expect(previousState.spectrum).toEqual(stateCopy.spectrum);
    });
  });
});
