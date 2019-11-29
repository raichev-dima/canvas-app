import Canvas from './Canvas';

const ActionTypes = {
  CREATE_CANVAS: 'C',
  DRAW_LINE: 'L',
  DRAW_RECTANGLE: 'R',
  BUCKET_FILL: 'B',
};

const stringsToIntegers = strings =>
  strings.map(i => {
    try {
      return JSON.parse(i);
    } catch (e) {
      throw new Error("Couldn't perform the action: inputs are not numbers");
    }
  });

let canvas;

function performActionOnCanvas(type, ...args) {
  if (type === ActionTypes.CREATE_CANVAS) {
    canvas = Canvas.create(...stringsToIntegers(args));
    return canvas.print();
  }

  if (!canvas) {
    throw new Error(`Couldn't paint on non-existent canvas`);
  }

  switch (type) {
    case ActionTypes.DRAW_LINE:
      canvas.drawLine(...stringsToIntegers(args));
      return canvas.print();
    case ActionTypes.DRAW_RECTANGLE:
      canvas.drawRectangle(...stringsToIntegers(args));
      return canvas.print();
    case ActionTypes.BUCKET_FILL:
      const color = args.slice(-1);
      const others = args.slice(0, -1);
      canvas.fill(...stringsToIntegers(others), color);
      return canvas.print();
    default:
      throw new Error(`Couldn't perform unknown action on canvas`);
  }
}

export function processInputString(str) {
  try {
    const actions = str.split('\n').filter(action => action.length);
    let result = '';
    let snapshot;

    while (actions.length) {
      const [next, ...args] = actions.shift().split(' ');
      snapshot = performActionOnCanvas(next, ...args);
      result = `${result}${snapshot}\n`;
    }

    return [result, snapshot];
  } catch (e) {
    throw new Error(`Couldn't process the input: ${e.message}`);
  }
}

async function prepareOutput(file) {
  const [result, snapshot] = await processInputFile(file);
  const blob = new File([result], 'output.txt');

  return [result, URL.createObjectURL(blob), snapshot];
}

function processInputFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('You need to provide the input file');
    }

    if (file.type !== 'text/plain') {
      reject(`Couldn't read the non-text format file`);
    }
    const reader = new FileReader();

    reader.onload = function() {
      const text = reader.result;
      try {
        const result = processInputString(text);
        resolve(result);
      } catch (e) {
        reject(`Couldn't read the file: ${e.message}`);
      }
    };

    reader.readAsText(file);
  });
}

export function createInputHandler(postMessage) {
  return async e => {
    if (!e) return;

    const file = e.data[0];

    try {
      const [result, dataUrl, snapshot] = await prepareOutput(file);

      postMessage({ result, url: dataUrl, snapshot });
    } catch (error) {
      postMessage({ error });
    }
  };
}

export default {
  prepareOutput,
  processInputFile,
  processInputString,
};
