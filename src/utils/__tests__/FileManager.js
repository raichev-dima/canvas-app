import fs from 'fs';
import path from 'path';

import FileManager from '../FileManager';

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, filePath), 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}

describe('parseInputString', () => {
  it('should process input file', async done => {
    const input = await readFile('../../../examples/input.txt');
    const output = await readFile('../../../examples/output.txt');

    const [result] = FileManager.processInputString(input);

    expect(result).toBe(output);

    done();
  });

  it('should handle errors', async done => {
    const errorInput1 = 'L 1 2 6 2';

    expect(() => FileManager.processInputString(errorInput1)).toThrowError(
      "Couldn't process the input: Couldn't paint on non-existent canvas"
    );

    const errorInput2 = 'C 12 12\nL 1 a a 2';

    expect(() => FileManager.processInputString(errorInput2)).toThrowError(
      "Couldn't process the input: Couldn't perform the action: inputs are not numbers"
    );

    const errorInput3 = 'C 12 12\nA 1 1 1 2';

    expect(() => FileManager.processInputString(errorInput3)).toThrowError(
      "Couldn't process the input: Couldn't perform unknown action on canvas"
    );

    try {
      await FileManager.processInputFile(undefined);
    } catch (e) {
      expect(e).toBe('You need to provide the input file');
    }

    try {
      await FileManager.processInputFile({ type: 'any-random-type' });
    } catch (e) {
      expect(e).toBe('Couldn\'t read the non-text format file');
    }

    done();
  });
});
