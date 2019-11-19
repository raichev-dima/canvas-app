import React from 'react';

import processInputFile from '../../utils/processInputFile';
import SrOnly from '../SrOnly/SrOnly';
import styles from './DataFileInput.module.scss';

const FILE_INPUT_ID = 'file-input';

function DataFileInput() {
  const handleFileOpen = async e => {
    const [file] = e.target.files;

    // eslint-disable-next-line no-unused-vars
    const result = await processInputFile(file);
    // TODO
  };

  return (
    <div className={styles.inputDataField}>
      <label className={styles.inputDataField__label} htmlFor={FILE_INPUT_ID}>
        Drag your input file here or click in this area.
      </label>
      <SrOnly>
        <input
          type="file"
          id={FILE_INPUT_ID}
          accept=".txt"
          onChange={handleFileOpen}
        />
      </SrOnly>
    </div>
  );
}

export default DataFileInput;
