import React from 'react';

import processInputFile from '../utils/processInputFile';
import styles from './DataFileInput.module.scss';

function DataFileInput() {
  const handleFileOpen = async e => {
    const [file] = e.target.files;

    const result = await processInputFile(file);
    // TODO
  };

  return (
    <div className={styles.inputDataField}>
      <label className={styles.inputDataField__label} htmlFor="input-file">
        Choose data input file
      </label>
      <input
        className={styles.inputDataField__input}
        type="file"
        id="input-file"
        accept=".txt"
        onChange={handleFileOpen}
      />
    </div>
  );
}

export default DataFileInput;
