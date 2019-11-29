/* istanbul ignore file */
import { createInputHandler } from './utils/FileManager';

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', createInputHandler(self.postMessage));
