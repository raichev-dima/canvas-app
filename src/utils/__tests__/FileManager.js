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
  it('should process input file', async () => {
    const input = await readFile('../../../examples/input.txt');
    const output = await readFile('../../../examples/output.txt');

    const result = FileManager.processInputString(input);

    expect(result).toBe(output);
  });
});
