import Canvas from '../Canvas';

describe('Canvas', () => {
  describe('create', () => {
    it('should create a new canvas', () => {
      const width = 12;
      const height = 34;
      const canvas = Canvas.create(width, height);

      expect(canvas.height).toBe(height);
      expect(canvas.width).toBe(width);
    });

    it('should throw an exception when passed the invalid parameters', () => {
      expect(() => Canvas.create(12)).toThrow();
      expect(() => Canvas.create('12', 34)).toThrow();
      expect(() => Canvas.create(12, NaN)).toThrow();
      expect(() => Canvas.create(12, 34)).not.toThrow();
    });

    it('should initialize its matrix representation', () => {
      const width = 5;
      const height = 6;

      const matrix = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];

      const canvas = Canvas.create(width, height);

      expect(canvas.matrix).toEqual(matrix);
    });
  });
});
