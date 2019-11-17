const Exceptions = {
  Canvas: "Can't create a canvas",
  Line: "Can't draw a line",
  Rectangle: "Can't draw a rectangle",
  BucketFill: "Can't do a filling for this area",
};

const Pixels = {
  Point: Symbol('x'),
  Empty: Symbol(' '),
};

function symbolToString(symbol) {
  // eslint-disable-next-line no-unused-vars
  const [_, match] = symbol.toString().match(/^Symbol\(([\w ]+)\)$/);
  return match;
}

export function matrixToString(matrix) {
  const [topRow] = matrix;
  const borderLine = `-${topRow.map(() => '-').join('')}-`;
  const body = matrix.reduce(
    (str, row) => `${str}|${row.map(symbolToString).join('')}|\n`,
    ''
  );
  return `${borderLine}\n${body}${borderLine}`;
}

function checkIfAllValuesAreIntegers(...args) {
  return (
    args.length && args.every(arg => Number.isSafeInteger(arg) && arg >= 0)
  );
}

function checkIfAllValuesInRange(a, b, ...values) {
  return values.every(value => value >= a && value <= b);
}

function checkIfPointsAreInCanvasArea(height, width, x1, y1, x2, y2) {
  return (
    checkIfAllValuesInRange(1, width, x1, x2) &&
    checkIfAllValuesInRange(1, height, y1, y2)
  );
}

function checkIfAllValuesAreTruthy(...args) {
  return args.every(arg => Boolean(arg));
}

function createVectorByCoordinates(a, b) {
  return [Math.min(a, b), Math.max(a, b)];
}

class Canvas {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this._matrix = [];

    this._init();
  }

  static create = (width, height) => {
    if (!checkIfAllValuesAreIntegers(width, height)) {
      throw new Error(`${Exceptions.Canvas}: dimensions aren't safe integers`);
    }

    return new Canvas(width, height);
  };

  _init() {
    for (let i = 0; i < this._height; ++i) {
      this._matrix[i] = [];

      for (let j = 0; j < this._width; ++j) {
        this._matrix[i][j] = Pixels.Empty;
      }
    }
  }

  print() {
    return matrixToString(this._matrix);
  }

  drawLine(x1, y1, x2, y2) {
    const isVertical = x1 === x2;
    const isHorizontal = y1 === y2;

    if (!checkIfAllValuesAreTruthy(x1, y1, x2, y2)) {
      throw new Error(
        `${Exceptions.Line}: likely you forgot to provide some values to draw the line`
      );
    }

    if (
      !checkIfPointsAreInCanvasArea(this._height, this._width, x1, y1, x2, y2)
    ) {
      throw new Error(
        `${Exceptions.Line}: input values are out of canvas area`
      );
    }

    if (!(isHorizontal || isVertical)) {
      throw new Error(
        `${Exceptions.Line}: line should be either horizontal or vertical`
      );
    }

    if (isVertical) {
      let [start, end] = createVectorByCoordinates(y1, y2);

      for (let i = start - 1; i < end; ++i) {
        this._matrix[i][x1 - 1] = Pixels.Point;
      }
    }

    if (isHorizontal) {
      let [start, end] = createVectorByCoordinates(x1, x2);

      for (let i = start - 1; i < end; ++i) {
        this._matrix[y1 - 1][i] = Pixels.Point;
      }
    }
  }

  drawRectangle(x1, y1, x2, y2) {
    try {
      this.drawLine(x1, y1, x2, y1);
      this.drawLine(x2, y1, x2, y2);
      this.drawLine(x2, y2, x1, y2);
      this.drawLine(x1, y2, x1, y1);
    } catch (e) {
      throw new Error(`${Exceptions.Rectangle}: ${e.message}`);
    }
  }
}

export default Canvas;
