import { SHAPES, COLORS, getPieceColor, getShape, rotatePiece } from '../../src/utils/pieces.js';

describe('pieces.js', () => {

    describe('SHAPES constant', () => {
        test('should contain all 7 tetrimino types', () => {
            const types = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];

            types.forEach(type => {
                expect(SHAPES[type]).toBeDefined();
                expect(SHAPES[type].length).toBe(4); // 4 rotations
            });
        });

        test('each shape should have 4 rotations', () => {
            Object.values(SHAPES).forEach(shapeRotations => {
                expect(shapeRotations.length).toBe(4);
            });
        });

        test('each rotation should have 4 blocks', () => {
            Object.values(SHAPES).forEach(shapeRotations => {
                shapeRotations.forEach(rotation => {
                    expect(rotation.length).toBe(4);
                });
            });
        });
    });

    describe('COLORS constant', () => {
        test('should contain colors for all tetrimino types', () => {
            expect(COLORS.I).toBe('cyan');
            expect(COLORS.O).toBe('yellow');
            expect(COLORS.T).toBe('purple');
            expect(COLORS.S).toBe('green');
            expect(COLORS.Z).toBe('red');
            expect(COLORS.J).toBe('blue');
            expect(COLORS.L).toBe('orange');
        });

        test('should contain PENALTY color', () => {
            expect(COLORS.PENALTY).toBe('gray');
        });
    });

    describe('getPieceColor()', () => {
        test('should return correct color for each piece type', () => {
            expect(getPieceColor('I')).toBe('cyan');
            expect(getPieceColor('O')).toBe('yellow');
            expect(getPieceColor('T')).toBe('purple');
            expect(getPieceColor('S')).toBe('green');
            expect(getPieceColor('Z')).toBe('red');
            expect(getPieceColor('J')).toBe('blue');
            expect(getPieceColor('L')).toBe('orange');
        });

        test('should return color for PENALTY', () => {
            expect(getPieceColor('PENALTY')).toBe('gray');
        });

        test('should return undefined for invalid type', () => {
            expect(getPieceColor('INVALID')).toBeUndefined();
        });
    });

    describe('getShape()', () => {
        test('should return correct shape for rotation 0', () => {
            const piece = { type: 'I', rotation: 0 };
            const shape = getShape(piece);

            expect(shape).toEqual([[0,1], [1,1], [2,1], [3,1]]);
        });

        test('should return correct shape for rotation 1', () => {
            const piece = { type: 'I', rotation: 1 };
            const shape = getShape(piece);

            expect(shape).toEqual([[2,0], [2,1], [2,2], [2,3]]);
        });

        test('should return correct shape for rotation 2', () => {
            const piece = { type: 'J', rotation: 2 };
            const shape = getShape(piece);

            expect(shape).toEqual([[0,1], [1,1], [2,1], [2,2]]);
        });

        test('should return correct shape for rotation 3', () => {
            const piece = { type: 'T', rotation: 3 };
            const shape = getShape(piece);

            expect(shape).toEqual([[0,1], [1,1], [1,0], [1,2]]);
        });

        test('should work for all piece types', () => {
            const types = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];

            types.forEach(type => {
                const piece = { type, rotation: 0 };
                const shape = getShape(piece);

                expect(shape).toBeDefined();
                expect(Array.isArray(shape)).toBe(true);
                expect(shape.length).toBe(4);
            });
        });

        test('should return same shape for O piece at all rotations', () => {
            const shapes = [0, 1, 2, 3].map(rotation =>
                getShape({ type: 'O', rotation })
            );

            // Toutes les rotations de O devraient être identiques
            expect(shapes[0]).toEqual(shapes[1]);
            expect(shapes[1]).toEqual(shapes[2]);
            expect(shapes[2]).toEqual(shapes[3]);
        });
    });

    describe('rotatePiece()', () => {
        test('should rotate piece from 0 to 1', () => {
            const piece = { type: 'I', x: 5, y: 10, rotation: 0 };
            const rotated = rotatePiece(piece);

            expect(rotated.type).toBe('I');
            expect(rotated.x).toBe(5);
            expect(rotated.y).toBe(10);
            expect(rotated.rotation).toBe(1);
        });

        test('should rotate piece from 1 to 2', () => {
            const piece = { type: 'J', x: 3, y: 5, rotation: 1 };
            const rotated = rotatePiece(piece);

            expect(rotated.rotation).toBe(2);
        });

        test('should rotate piece from 2 to 3', () => {
            const piece = { type: 'L', x: 4, y: 8, rotation: 2 };
            const rotated = rotatePiece(piece);

            expect(rotated.rotation).toBe(3);
        });

        test('should cycle rotation from 3 back to 0', () => {
            const piece = { type: 'T', x: 6, y: 12, rotation: 3 };
            const rotated = rotatePiece(piece);

            expect(rotated.rotation).toBe(0);
        });

        test('should not modify original piece', () => {
            const piece = { type: 'S', x: 7, y: 15, rotation: 1 };
            const rotated = rotatePiece(piece);

            expect(piece.rotation).toBe(1);
            expect(rotated.rotation).toBe(2);
            expect(rotated).not.toBe(piece);
        });

        test('should preserve other properties', () => {
            const piece = {
                type: 'Z',
                x: 2,
                y: 3,
                rotation: 0,
                customProp: 'test'
            };
            const rotated = rotatePiece(piece);

            expect(rotated.type).toBe('Z');
            expect(rotated.x).toBe(2);
            expect(rotated.y).toBe(3);
            expect(rotated.customProp).toBe('test');
        });

        test('should work for all piece types', () => {
            const types = ['I', 'O', 'J', 'L', 'S', 'Z', 'T'];

            types.forEach(type => {
                const piece = { type, x: 5, y: 10, rotation: 0 };
                const rotated = rotatePiece(piece);

                expect(rotated.rotation).toBe(1);
                expect(rotated.type).toBe(type);
            });
        });
    });
});
