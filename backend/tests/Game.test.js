import Game from '../src/models/Game.js'
import Player from '../src/models/Player.js'

describe('Game', () => {

    test('constructor', () => {
        const game = new Game('test');

        expect(game.roomName).toBe('test');
        expect(game.players).toStrictEqual([]);
        expect(game.state).toBe('waiting');
        expect(game.pieceSequence).toStrictEqual([]);
        expect(game.maxPieceIndex).toBe(0);
        expect(game.host).toBe(null);
    });
    
    test('addPlayer()', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        expect(game.addPlayer(player1)).toBe(true);
        expect(game.host).toBe(player1);
        expect(game.addPlayer(player1)).toBe(true);
        expect(game.players).toStrictEqual([player1]);
        game.reset()
        expect(game.players).toStrictEqual([]);
        expect(game.host).toBe(null);
    });

    test('removePlayer(playerOrId)', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        const player2 = new Player('Player2', 'Felfel');
        game.addPlayer(player1);
        expect(game.players).toStrictEqual([player1]);
        game.removePlayer('Player1');
        expect(game.players).toStrictEqual([]);
        game.addPlayer(player1);
        game.addPlayer(player2);
        expect(game.host).toBe(player1);
        game.removePlayer(player1);
        expect(game.host).toBe(player2);
        game.removePlayer(player2);
        expect(game.players).toStrictEqual([]);

    });

    test('start()', () => {
        const game = new Game('test');
        expect(game.start()).toBe(false);
        const player1 = new Player('Player1', 'Isma');
        game.addPlayer(player1);
        game.start();
        expect(game.state).toBe('playing');
        expect(game.pieceSequence.length).toBe(100);
        expect(game.maxPieceIndex).toBe(0);
        game.reset();
        expect(game.state).toBe('waiting');
        expect(game.pieceSequence).toStrictEqual([]);
    });

    test('getNextPiece(player)', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        const player2 = new Player('Player2', 'Felfel');
        game.addPlayer(player1);
        game.addPlayer(player2);
        game.start();
        const piece1ForPlayer1 = game.getNextPiece(player1);
        const piece1ForPlayer2 = game.getNextPiece(player2);
        expect(piece1ForPlayer1.type).toBe(piece1ForPlayer2.type);
        expect(player1.currentPieceIndex).toBe(1);
        expect(player2.currentPieceIndex).toBe(1);
        expect(game.maxPieceIndex).toBe(1);
        const piece2ForPlayer1 = game.getNextPiece(player1);
        expect(player1.currentPieceIndex).toBe(2);
        expect(game.maxPieceIndex).toBe(2);
        const piece3ForPlayer1 = game.getNextPiece(player1);
        expect(player1.currentPieceIndex).toBe(3);
        expect(player2.currentPieceIndex).toBe(1);
        expect(game.maxPieceIndex).toBe(3);
    });

    test('generatePieceSequence(count)', () => {
        const game = new Game('test');
        game.generatePieceSequence(50);
        expect(game.pieceSequence.length).toBe(50);
        const validTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        game.pieceSequence.forEach(piece => {
            expect(validTypes).toContain(piece.type);
            expect(piece.x).toBe(3);
            expect(piece.y).toBe(0);
        });
        for (let i = 1; i < game.pieceSequence.length; i++) {
            expect(game.pieceSequence[i].type).not.toBe(game.pieceSequence[i - 1].type);
        }
    });

    test('getPlayer(id)', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        const player2 = new Player('Player2', 'Felfel');
        game.addPlayer(player1);
        game.addPlayer(player2);
        expect(game.getPlayer('Player1')).toBe(player1);
        expect(game.getPlayer('Player2')).toBe(player2);
        expect(game.getPlayer('NonExistent')).toBe(null);
    });

    test('checkWinner() - no players alive', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        const player2 = new Player('Player2', 'Felfel');
        game.addPlayer(player1);
        game.addPlayer(player2);
        game.start();
        player1.lose();
        player2.lose();
        const winner = game.checkWinner();
        expect(winner).toBe(null);
        expect(game.state).toBe('finished');
    });

    test('checkWinner() - one player alive in multiplayer', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        const player2 = new Player('Player2', 'Felfel');
        game.addPlayer(player1);
        game.addPlayer(player2);
        game.start();
        player1.lose();
        const winner = game.checkWinner();
        expect(winner).toBe(player2);
        expect(game.state).toBe('finished');
    });

    test('checkWinner() - solo game', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        game.addPlayer(player1);
        game.start();
        player1.lose();
        const winner = game.checkWinner();
        expect(winner).toBe(null);
        expect(game.state).toBe('finished');
    });

    test('checkWinner() - game still ongoing', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        const player2 = new Player('Player2', 'Felfel');
        game.addPlayer(player1);
        game.addPlayer(player2);
        game.start();
        const winner = game.checkWinner();
        expect(winner).toBe(null);
        expect(game.state).toBe('playing');
    });

    test('getNextPiece() should generate more pieces when reaching the end', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        game.addPlayer(player1);
        game.start();
        expect(game.pieceSequence.length).toBe(100);
        player1.currentPieceIndex = 99;
        game.getNextPiece(player1);
        game.getNextPiece(player1);
        expect(game.pieceSequence.length).toBe(150);
        expect(player1.currentPieceIndex).toBe(101);
    });

    test('cleanup() should clear all player timers', () => {
        const game = new Game('test');
        const player1 = new Player('Player1', 'Isma');
        const player2 = new Player('Player2', 'Felfel');
        game.addPlayer(player1);
        game.addPlayer(player2);
        player1.gameLoopTimer = setInterval(() => {}, 1000);
        player2.gameLoopTimer = setInterval(() => {}, 1000);
        game.cleanup();
        expect(player1.gameLoopTimer).toBe(null);
        expect(player2.gameLoopTimer).toBe(null);
    });
});

// Helper pour créer un mock de socket.io
function createMockIo() {
    const emissions = [];

    const mockIo = {
        to: (room) => ({
            emit: (event, data) => {
                emissions.push({ room, event, data });
            }
        }),
        getEmissions: () => emissions,
        clearEmissions: () => emissions.splice(0, emissions.length)
    };

    return mockIo;
}

describe('Game - Methods with socket.io', () => {

    test('applyPenaltyLines() should add penalty lines to player board', () => {
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        // Créer un board avec quelques lignes
        player.board = Array(20).fill(null).map(() => Array(10).fill(0));
        player.pendingPenaltyLines = 3;

        const baseBoard = [...player.board];
        game.applyPenaltyLines(player, baseBoard);

        // Vérifier que le board a bien 20 lignes
        expect(player.board.length).toBe(20);

        // Vérifier que les 3 dernières lignes sont des lignes de pénalité
        const lastThreeLines = player.board.slice(-3);
        lastThreeLines.forEach(line => {
            const penaltyCount = line.filter(cell => cell === 'PENALTY').length;
            expect(penaltyCount).toBe(9); // 9 cellules de pénalité + 1 trou
            expect(line.filter(cell => cell === 0).length).toBe(1); // 1 trou
        });

        // Vérifier que pendingPenaltyLines est remis à 0
        expect(player.pendingPenaltyLines).toBe(0);
    });

    test('handlePlayerInput() - left movement', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        // Spawn une pièce pour le joueur
        player.currentPiece = { type: 'I', x: 5, y: 0, rotation: 0 };

        game.handlePlayerInput(player, 'left', mockIo);

        // La pièce devrait avoir bougé à gauche
        expect(player.currentPiece.x).toBe(4);

        // Vérifier qu'un événement a été émis
        const emissions = mockIo.getEmissions();
        expect(emissions.length).toBeGreaterThan(0);
        expect(emissions[0].event).toBe('piece:position-update');
    });

    test('handlePlayerInput() - right movement', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        player.currentPiece = { type: 'I', x: 3, y: 0, rotation: 0 };

        game.handlePlayerInput(player, 'right', mockIo);

        expect(player.currentPiece.x).toBe(4);
    });

    test('handlePlayerInput() - down movement', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        player.currentPiece = { type: 'I', x: 3, y: 0, rotation: 0 };

        game.handlePlayerInput(player, 'down', mockIo);

        expect(player.currentPiece.y).toBe(1);
    });

    test('handlePlayerInput() - rotate', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        player.currentPiece = { type: 'I', x: 3, y: 0, rotation: 0 };

        game.handlePlayerInput(player, 'rotate', mockIo);

        expect(player.currentPiece.rotation).toBe(1);
    });

    test('handlePlayerInput() - hardDrop should lock piece', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        player.currentPiece = { type: 'I', x: 3, y: 0, rotation: 0 };

        game.handlePlayerInput(player, 'hardDrop', mockIo);

        // Après hardDrop, la pièce devrait être lockée (currentPiece = null)
        // Note: lockPiece met currentPiece à null
        expect(player.currentPiece).toBe(null);
    });

    test('handlePlayerInput() - should not move if player not alive', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        player.currentPiece = { type: 'I', x: 3, y: 0, rotation: 0 };
        player.isAlive = false;

        game.handlePlayerInput(player, 'left', mockIo);

        // La pièce ne devrait pas avoir bougé
        expect(player.currentPiece.x).toBe(3);
    });

    test('handlePlayerInput() - should not move if no current piece', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        player.currentPiece = null;

        game.handlePlayerInput(player, 'left', mockIo);

        // Aucune erreur ne devrait être levée
        expect(player.currentPiece).toBe(null);
    });

    test('handlePlayerInput() - should throttle inputs', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        player.currentPiece = { type: 'I', x: 3, y: 0, rotation: 0 };
        player.lastInputTime = Date.now(); // Dernière input juste maintenant

        const initialX = player.currentPiece.x;

        // Essayer de bouger immédiatement (devrait être throttled)
        game.handlePlayerInput(player, 'left', mockIo);

        // La pièce ne devrait pas avoir bougé (throttled)
        expect(player.currentPiece.x).toBe(initialX);
    });

    test('startPlayerGameLoop() should create an interval', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');
        game.addPlayer(player);
        game.start();
        expect(player.gameLoopTimer).toBe(null);
        game.startPlayerGameLoop(player, mockIo);
        game.startPlayerGameLoop(player, mockIo);
        expect(player.gameLoopTimer).not.toBe(null);
        clearInterval(player.gameLoopTimer);
    });

    test('startGameLoops() should start loops for all alive players', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player1 = new Player('player1', 'Test1');
        const player2 = new Player('player2', 'Test2');

        game.addPlayer(player1);
        game.addPlayer(player2);
        game.start();

        game.startGameLoops(mockIo);

        expect(player1.gameLoopTimer).not.toBe(null);
        expect(player2.gameLoopTimer).not.toBe(null);

        // Cleanup
        clearInterval(player1.gameLoopTimer);
        clearInterval(player2.gameLoopTimer);
    });

    test('autoDropPiece() should move piece down', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        player.currentPiece = { type: 'I', x: 3, y: 17, rotation: 0 };
        const initialY = player.currentPiece.y;

        game.autoDropPiece(player, mockIo);

        // La pièce devrait avoir descendu
        expect(player.currentPiece.y).toBe(initialY + 1);
    });

    test('lockPiece() should lock piece to board', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        player.currentPiece = { type: 'I', x: 3, y: 18, rotation: 0 };

        game.lockPiece(player, mockIo);

        // La pièce devrait être null après lock
        expect(player.currentPiece).toBe(null);

        // Des événements devraient avoir été émis
        const emissions = mockIo.getEmissions();
        expect(emissions.length).toBeGreaterThan(0);
    });

    test('spawnNextPiece() should spawn a new piece for player', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        expect(player.currentPiece).toBe(null);

        game.spawnNextPiece(player, mockIo);

        // Le joueur devrait avoir une nouvelle pièce
        expect(player.currentPiece).not.toBe(null);
        expect(player.currentPieceIndex).toBe(1);

        // Des événements devraient avoir été émis
        const emissions = mockIo.getEmissions();
        expect(emissions.length).toBeGreaterThan(0);
    });

    test('spawnNextPiece() should detect game over if piece cannot spawn', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player = new Player('player1', 'Test');

        game.addPlayer(player);
        game.start();

        // Remplir le haut du board pour empêcher le spawn
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 10; x++) {
                player.board[y][x] = 'I';
            }
        }

        game.spawnNextPiece(player, mockIo);

        // Le joueur devrait avoir perdu
        expect(player.isAlive).toBe(false);

        // Un événement player:lost devrait avoir été émis
        const emissions = mockIo.getEmissions();
        const lostEvent = emissions.find(e => e.event === 'player:lost');
        expect(lostEvent).toBeDefined();
    });

    test('lockPiece() with lines cleared should send penalty to opponents', () => {
        const mockIo = createMockIo();
        const game = new Game('test');
        const player1 = new Player('player1', 'Test1');
        const player2 = new Player('player2', 'Test2');

        game.addPlayer(player1);
        game.addPlayer(player2);
        game.start();

        // Créer deux lignes presque pleines (ligne 18 et 19)
        for (let x = 0; x < 10; x++) {
            player1.board[18][x] = 'I';
            player1.board[19][x] = 'I';
        }
        // Laisser des trous à x=0 sur les deux lignes
        player1.board[18][0] = 0;
        player1.board[19][0] = 0;

        // Placer une pièce O (carré 2x2) qui va compléter les deux lignes
        // La pièce O en rotation 0: [[1,0], [2,0], [1,1], [2,1]]
        // Si on la place à x=-1, y=18, elle remplira x=0,1 sur y=18,19
        player1.currentPiece = { type: 'O', x: -1, y: 18, rotation: 0 };

        const initialPenalty = player2.pendingPenaltyLines;

        game.lockPiece(player1, mockIo);

        // 2 lignes cleared - 1 = 1 ligne de pénalité
        expect(player2.pendingPenaltyLines).toBe(initialPenalty + 1);

        // Vérifier que player1 a bien cleared 2 lignes
        expect(player1.linesCleared).toBe(2);
    });
});

