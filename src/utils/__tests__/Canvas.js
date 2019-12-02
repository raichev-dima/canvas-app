import Canvas from '../Canvas';

describe('Canvas', () => {
  describe('create', () => {
    it('should create a new canvas', () => {
      const width = 12;
      const height = 34;
      const canvas = Canvas.create(width, height);

      expect(canvas._height).toBe(height);
      expect(canvas._width).toBe(width);
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

      const result =
        '-------\n' +
        '|     |\n' +
        '|     |\n' +
        '|     |\n' +
        '|     |\n' +
        '|     |\n' +
        '|     |\n' +
        '-------';

      const canvas = Canvas.create(width, height);

      expect(canvas.print()).toEqual(result);
    });
  });

  describe('drawLine', () => {
    let canvas;
    const width = 5;
    const height = 6;
    beforeEach(() => {
      canvas = Canvas.create(width, height);
    });

    it('should throw an exception when passed the invalid parameters', () => {
      expect(() => canvas.drawLine(12, 23, 5, 9)).toThrow();
      expect(() => canvas.drawLine(12, 23)).toThrow();
      expect(() => canvas.drawLine(2, 3, 2, 6)).not.toThrow();
      expect(() => canvas.drawLine(1, 3, 2, 8)).toThrow();
      expect(() => canvas.drawLine(5, 6, 2, 6)).not.toThrow();
    });

    it('should draw a vertical line', () => {
      const result =
        '-------\n' +
        '|     |\n' +
        '|     |\n' +
        '|x    |\n' +
        '|x    |\n' +
        '|x    |\n' +
        '|x    |\n' +
        '-------';

      canvas.drawLine(1, 3, 1, 6);
      expect(canvas.print()).toEqual(result);
    });

    it('should draw a horizontal line', () => {
      const result =
        '-------\n' +
        '|     |\n' +
        '|     |\n' +
        '| xxxx|\n' +
        '|     |\n' +
        '|     |\n' +
        '|     |\n' +
        '-------';

      canvas.drawLine(2, 3, 5, 3);
      expect(canvas.print()).toEqual(result);
    });

    it('should draw different lines', () => {
      const result =
        '-------\n' +
        '|  x  |\n' +
        '|  x  |\n' +
        '| xxxx|\n' +
        '|  x  |\n' +
        '|  x  |\n' +
        '|x  xx|\n' +
        '-------';

      canvas.drawLine(2, 3, 5, 3);
      canvas.drawLine(3, 5, 3, 1);
      canvas.drawLine(1, 6, 1, 6);
      canvas.drawLine(4, 6, 5, 6);

      expect(canvas.print()).toEqual(result);
    });

    it('should handle progress percentage', () => {
      /**
        -------
        |     |
        |     |
        |x    |
        |x    |
        |x    |
        |x    |
        -------

       */

      const getProgressPercentage = jest.fn();
      canvas.drawLine(1, 3, 1, 6, getProgressPercentage);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(1, 0);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(2, (1 / 4) * 100);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(3, (2 / 4) * 100);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(4, (3 / 4) * 100);
      expect(getProgressPercentage).toHaveBeenCalledTimes(4);
    });
  });

  describe('drawRectangle', () => {
    let canvas;
    const width = 5;
    const height = 6;
    beforeEach(() => {
      canvas = Canvas.create(width, height);
    });

    it('should throw an exception when passed the invalid parameters', () => {
      expect(() => canvas.drawRectangle(12, 23, 5, 9)).toThrow();
      expect(() => canvas.drawRectangle(12, 23)).toThrow();
      expect(() => canvas.drawRectangle(2, 3, 2, 6)).not.toThrow();
      expect(() => canvas.drawRectangle(1, 3, 2, 8)).toThrow();
      expect(() => canvas.drawRectangle(5, 6, 2, 6)).not.toThrow();
    });

    it('should draw different rectangles', () => {
      const result =
        '-------\n' +
        '|xxxx |\n' +
        '|x  x |\n' +
        '|x xxx|\n' +
        '|xxxxx|\n' +
        '|  x x|\n' +
        '|x xxx|\n' +
        '-------';

      canvas.drawRectangle(1, 1, 4, 4);
      canvas.drawRectangle(3, 3, 5, 6);
      canvas.drawRectangle(1, 6, 1, 6);

      expect(canvas.print()).toEqual(result);
    });

    it('should handle progress percentage', () => {
      const result =
        '-------\n' +
        '|xxxx |\n' +
        '|x  x |\n' +
        '|xxxx |\n' +
        '|     |\n' +
        '|     |\n' +
        '|     |\n' +
        '-------';

      const getProgressPercentage = jest.fn();
      canvas.drawRectangle(1, 1, 4, 3, getProgressPercentage);

      expect(canvas.print()).toEqual(result);

      expect(getProgressPercentage).toHaveBeenCalledTimes(14);

      expect(getProgressPercentage).toHaveBeenNthCalledWith(1, 0);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(2, (1 / 4) * 100);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(3, (2 / 4) * 100);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(4, (3 / 4) * 100);

      expect(getProgressPercentage).toHaveBeenNthCalledWith(5, 0);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(6, (1 / 3) * 100);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(7, (2 / 3) * 100);

      expect(getProgressPercentage).toHaveBeenNthCalledWith(8, 0);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(9, (1 / 4) * 100);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(10, (2 / 4) * 100);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(11, (3 / 4) * 100);

      expect(getProgressPercentage).toHaveBeenNthCalledWith(12, 0);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(13, (1 / 3) * 100);
      expect(getProgressPercentage).toHaveBeenNthCalledWith(14, (2 / 3) * 100);
    });
  });

  describe('fill', () => {
    /**
     *
     *  C 20 4
     *
     */

    let canvas;
    const width = 20;
    const height = 4;
    beforeEach(() => {
      canvas = Canvas.create(width, height);
    });

    it('should throw an exception when passed the invalid parameters', () => {
      expect(() => canvas.fill(12, 23, 5)).toThrow();
      expect(() => canvas.fill(24, 2)).toThrow();
      expect(() => canvas.fill()).toThrow();
      expect(() => canvas.fill(2, 3, 2)).not.toThrow();
    });

    it('should fill the area with the provided color', () => {
      const result1 =
        '----------------------\n' +
        '|oooooooooooooooxxxxx|\n' +
        '|xxxxxxooooooooox   x|\n' +
        '|     xoooooooooxxxxx|\n' +
        '|     xoooooooooooooo|\n' +
        '----------------------';

      /**
       *
       *  L 1 2 6 2
       *  L 6 3 6 4
       *  R 16 1 20 3
       *  B 10 3 o
       *
       */

      canvas.drawLine(1, 2, 6, 2);
      canvas.drawLine(6, 3, 6, 4);
      canvas.drawRectangle(16, 1, 20, 3);
      canvas.fill(10, 3, 'o');

      expect(canvas.print()).toEqual(result1);

      const result2 =
        '----------------------\n' +
        '|kkkkkkkkxooooooxxxxx|\n' +
        '|xxxxxxkkxoooooox   x|\n' +
        '|11111xkkxooooooxxxxx|\n' +
        '|11111xkkxooooooooooo|\n' +
        '----------------------';

      /**
       *
       *  L 9 1 9 4
       *  B 1 1 k
       *  B 4 4 1
       *  B 2 2 s -> shouldn't do something because the point is located on the line
       *
       */

      canvas.drawLine(9, 1, 9, 4);
      canvas.fill(2, 1, 'k');
      canvas.fill(4, 4, 1);
      canvas.fill(2, 2, 's');

      expect(canvas.print()).toEqual(result2);
    });

    it('should handle progress percentage', () => {
      canvas = Canvas.create(5, 6);
      const result =
        '-------\n' +
        '|xxxx |\n' +
        '|xoox |\n' +
        '|xoox |\n' +
        '|xxxx |\n' +
        '|     |\n' +
        '|     |\n' +
        '-------';

      const getProgressPercentage = jest.fn();
      canvas.drawRectangle(1, 1, 4, 4);
      canvas.fill(2, 2, 'o', getProgressPercentage);
      expect(canvas.print()).toEqual(result);

      expect(getProgressPercentage).toHaveBeenCalledTimes(12);

      Array(12)
        .fill(1)
        .forEach((_, i) => {
          expect(getProgressPercentage).toHaveBeenNthCalledWith(
            i + 1,
            ((i + 1) / (5 * 6)) * 100
          );
        });
    });
  });
});
