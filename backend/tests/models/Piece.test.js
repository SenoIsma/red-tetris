import Piece from '../../src/models/Piece';

describe('Piece', () => {

    test('constructor init', () => {

        const type = 'I';
        const piece = new Piece(type);

        expect(piece.type).toBe(type);
        expect(piece.x).toBe(3);
        expect(piece.y).toBe(0);
        expect(piece.rotation).toBe(0);
        expect(piece.color).toBe('cyan');
    })
});

describe('rotation() and getShape()', () => {

    test('piece should rotate correctly through all 4 rotations', () => {
        const piece = new Piece('J');

        expect(piece.rotation).toBe(0);
        expect(piece.getShape()).toStrictEqual([[0,0], [0,1], [1,1], [2,1]]);

        piece.rotate();
        expect(piece.rotation).toBe(1);
        expect(piece.getShape()).toStrictEqual([[1,0], [2,0], [1,1], [1,2]]);

        piece.rotate();
        expect(piece.rotation).toBe(2);
        expect(piece.getShape()).toStrictEqual([[0,1], [1,1], [2,1], [2,2]]);

        piece.rotate();
        expect(piece.rotation).toBe(3);
        expect(piece.getShape()).toStrictEqual([[0,2], [1,2], [1,1], [1,0]]);

        piece.rotate();
        expect(piece.rotation).toBe(0);
        expect(piece.getShape()).toStrictEqual([[0,0], [0,1], [1,1], [2,1]]);

        piece.rotate();
        expect(piece.rotation).toBe(1);
        expect(piece.getShape()).toStrictEqual([[1,0], [2,0], [1,1], [1,2]]);
    });
});