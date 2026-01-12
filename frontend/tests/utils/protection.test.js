import { describe, test, expect, jest } from '@jest/globals';
import { inputProtection } from '../../src/utils/protection.js';

describe('inputProtection(playerName, roomName, onError)', () => {

    test('roomName or playerName does not exist', () => {
        const onError = jest.fn();
        expect(inputProtection('', 'test', onError)).toBe(false);
        expect(onError).toHaveBeenCalledWith("Veuillez remplir tous les champs");
        onError.mockClear();
        expect(inputProtection('test', '', onError)).toBe(false);
        expect(onError).toHaveBeenCalledWith("Veuillez remplir tous les champs");
    });

    test('isValideName', () => {
        const wrongName = '@test';
        const validName = 'test';
        const wrongRoom = '123#@!';
        const validRoom = '123';
        const onError = jest.fn();
        expect(inputProtection(wrongName, validRoom, onError)).toBe(false);
        expect(onError).toHaveBeenCalledWith("Seulement lettres, chiffres, tirets et underscores");
        onError.mockClear();
        expect(inputProtection(validName, wrongRoom, onError)).toBe(false);
        expect(onError).toHaveBeenCalledWith("Seulement lettres, chiffres, tirets et underscores");
        onError.mockClear();
        expect(inputProtection(validName, validRoom, onError)).toBe(true);
        expect(onError).not.toHaveBeenCalled();
    });

    test('length', () => {
        const wrongName = 'testtttttttttttttttttttttttttttt';
        const validName = 'test';
        const wrongRoom = '1234567891011121314151617';
        const validRoom = '123';
        const onError = jest.fn();
        expect(inputProtection(wrongName, validRoom, onError)).toBe(false);
        expect(onError).toHaveBeenCalledWith("Le nom est trop long (max 20 caractères)");
        onError.mockClear();
        expect(inputProtection(validName, wrongRoom, onError)).toBe(false);
        expect(onError).toHaveBeenCalledWith("Le nom est trop long (max 20 caractères)");
        onError.mockClear();
        expect(inputProtection(validName, validRoom, onError)).toBe(true);
        expect(onError).not.toHaveBeenCalled();
    });

    test('without onError', () => {
        expect(inputProtection('', 'test')).toBe(false);
        expect(inputProtection('test', '')).toBe(false);
        expect(inputProtection('@test', 'test')).toBe(false);
        expect(inputProtection('test', '123#@!')).toBe(false);
        expect(inputProtection('testtttttttttttttttttttttttttttt', 'test')).toBe(false);
        expect(inputProtection('test', '1234567891011121314151617')).toBe(false);
        expect(inputProtection('test', 'room')).toBe(true);
    });
});