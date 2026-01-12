import Player from '../../src/models/Player.js';

// describe() permet de grouper plusieurs tests ensemble
describe('Player', () => {

  // test() ou it() définit un test individuel
  test('constructor should initialize player with correct properties', () => {
    // Arrange (Préparer) - Créer les données nécessaires
    const playerId = 'player1';
    const playerName = 'John';

    // Act (Agir) - Exécuter le code à tester
    const player = new Player(playerId, playerName);

    // Assert (Vérifier) - Vérifier que le résultat est correct
    expect(player.id).toBe(playerId);
    expect(player.name).toBe(playerName);
    expect(player.isAlive).toBe(true);
    expect(player.linesCleared).toBe(0);
    expect(player.currentPieceIndex).toBe(0);
    expect(player.pendingPenaltyLines).toBe(0);
    expect(player.board).toBe(null);
    expect(player.currentPiece).toBe(null);
    expect(player.gameLoopTimer).toBe(null);
  });

  test('lose() should set isAlive to false', () => {
    // Arrange
    const player = new Player('player1', 'John');

    // Act
    player.lose();

    // Assert
    expect(player.isAlive).toBe(false);
  });

  test('clearLines() should increment linesCleared by count', () => {
    // Arrange
    const player = new Player('player1', 'John');

    // Act
    player.clearLines(3);

    // Assert
    expect(player.linesCleared).toBe(3);

    // Act - on peut tester plusieurs fois
    player.clearLines(2);

    // Assert
    expect(player.linesCleared).toBe(5); // 3 + 2
  });

  test('addPenaltyLines() should increment pendingPenaltyLines by count', () => {
    // Arrange
    const player = new Player('player1', 'John');

    // Act
    player.addPenaltyLines(2);

    // Assert
    expect(player.pendingPenaltyLines).toBe(2);

    // Test incrémentation multiple
    player.addPenaltyLines(3);
    expect(player.pendingPenaltyLines).toBe(5);
  });

  test('updateBoard() should update the board property', () => {
    // Arrange
    const player = new Player('player1', 'John');
    const mockBoard = [[0, 0, 0], [1, 1, 0]];

    // Act
    player.updateBoard(mockBoard);

    // Assert
    expect(player.board).toEqual(mockBoard);
  });

  test('cleanup() should clear the gameLoopTimer', () => {
    // Arrange
    const player = new Player('player1', 'John');
    // Simuler un timer actif
    player.gameLoopTimer = setInterval(() => {}, 1000);

    // Act
    player.cleanup();

    // Assert
    expect(player.gameLoopTimer).toBe(null);
  });
});
