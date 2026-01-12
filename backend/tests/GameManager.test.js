import gameManager from '../src/managers/GameManager.js';
import Game from '../src/models/Game.js';

describe('GameManager', () => {

    // Nettoyer avant chaque test pour éviter les interférences
    beforeEach(() => {
        // Vider tous les jeux
        gameManager.games = {};
    });

    test('should be a singleton instance', () => {
        expect(gameManager).toBeDefined();
        expect(gameManager.games).toBeDefined();
        expect(typeof gameManager.games).toBe('object');
    });

    test('createGame() should create a new game', () => {
        const roomName = 'testRoom1';
        const game = gameManager.createGame(roomName);

        expect(game).not.toBe(null);
        expect(game).toBeInstanceOf(Game);
        expect(game.roomName).toBe(roomName);
        expect(gameManager.games[roomName]).toBe(game);
    });

    test('createGame() should return null if game already exists', () => {
        const roomName = 'testRoom2';

        // Créer le premier jeu
        const game1 = gameManager.createGame(roomName);
        expect(game1).not.toBe(null);

        // Essayer de créer un jeu avec le même nom
        const game2 = gameManager.createGame(roomName);
        expect(game2).toBe(null);

        // Vérifier qu'on a toujours le premier jeu
        expect(gameManager.games[roomName]).toBe(game1);
    });

    test('getGame() should return existing game', () => {
        const roomName = 'testRoom3';

        // Créer un jeu
        const createdGame = gameManager.createGame(roomName);

        // Récupérer le jeu
        const retrievedGame = gameManager.getGame(roomName);

        expect(retrievedGame).toBe(createdGame);
        expect(retrievedGame.roomName).toBe(roomName);
    });

    test('getGame() should return undefined for non-existent game', () => {
        const roomName = 'nonExistentRoom';

        const game = gameManager.getGame(roomName);

        expect(game).toBeUndefined();
    });

    test('getOrCreateGame() should return existing game if it exists', () => {
        const roomName = 'testRoom4';

        // Créer un jeu
        const createdGame = gameManager.createGame(roomName);

        // Utiliser getOrCreateGame
        const retrievedGame = gameManager.getOrCreateGame(roomName);

        // Devrait retourner le même jeu
        expect(retrievedGame).toBe(createdGame);
        expect(Object.keys(gameManager.games).length).toBe(1);
    });

    test('getOrCreateGame() should create game if it does not exist', () => {
        const roomName = 'testRoom5';

        // Vérifier qu'il n'existe pas
        expect(gameManager.games[roomName]).toBeUndefined();

        // Utiliser getOrCreateGame
        const game = gameManager.getOrCreateGame(roomName);

        // Devrait créer un nouveau jeu
        expect(game).not.toBe(null);
        expect(game).toBeInstanceOf(Game);
        expect(game.roomName).toBe(roomName);
        expect(gameManager.games[roomName]).toBe(game);
    });

    test('deleteGame() should delete existing game and return true', () => {
        const roomName = 'testRoom6';

        // Créer un jeu
        gameManager.createGame(roomName);
        expect(gameManager.games[roomName]).toBeDefined();

        // Supprimer le jeu
        const result = gameManager.deleteGame(roomName);

        expect(result).toBe(true);
        expect(gameManager.games[roomName]).toBeUndefined();
    });

    test('deleteGame() should return false if game does not exist', () => {
        const roomName = 'nonExistentRoom';

        // Essayer de supprimer un jeu qui n'existe pas
        const result = gameManager.deleteGame(roomName);

        expect(result).toBe(false);
    });

    test('getAllGames() should return all games as an array', () => {
        // Créer plusieurs jeux
        const game1 = gameManager.createGame('room1');
        const game2 = gameManager.createGame('room2');
        const game3 = gameManager.createGame('room3');

        const allGames = gameManager.getAllGames();

        expect(Array.isArray(allGames)).toBe(true);
        expect(allGames.length).toBe(3);
        expect(allGames).toContain(game1);
        expect(allGames).toContain(game2);
        expect(allGames).toContain(game3);
    });

    test('getAllGames() should return empty array if no games exist', () => {
        const allGames = gameManager.getAllGames();

        expect(Array.isArray(allGames)).toBe(true);
        expect(allGames.length).toBe(0);
    });

    test('multiple operations should work correctly', () => {
        // Créer des jeux
        const game1 = gameManager.createGame('room1');
        const game2 = gameManager.createGame('room2');

        expect(gameManager.getAllGames().length).toBe(2);

        // Supprimer un jeu
        gameManager.deleteGame('room1');
        expect(gameManager.getAllGames().length).toBe(1);

        // Créer un nouveau jeu
        const game3 = gameManager.createGame('room3');
        expect(gameManager.getAllGames().length).toBe(2);

        // Vérifier les jeux existants
        const allGames = gameManager.getAllGames();
        expect(allGames).toContain(game2);
        expect(allGames).toContain(game3);
        expect(allGames).not.toContain(game1);
    });
});
