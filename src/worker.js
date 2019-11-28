/* istanbul ignore file */
import FileManager from './utils/FileManager';

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', async e => {
  if (!e) return;

  const file = e.data[0];

  try {
    const [result, dataUrl, snapshot] = await FileManager.prepareOutput(file);

    postMessage({ result, url: dataUrl, snapshot });
  } catch (error) {
    throw error;
  }
});
