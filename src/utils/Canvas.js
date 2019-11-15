function checkInputValues(...args) {
  return args.length && args.every(arg => Number.isInteger(arg) && arg >= 0);
}

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.matrix = [];

    this._init();
  }

  static create = (width, height) => {
    if (!checkInputValues(width, height)) {
      throw new Error("Canvas dimensions aren't correct values");
    }

    return new Canvas(width, height);
  };

  _init() {
    for (let i = 0; i < this.height; ++i) {
      this.matrix[i] = [];

      for (let j = 0; j < this.width; ++j) {
        this.matrix[i][j] = 0;
      }
    }
  }
}

export default Canvas;
