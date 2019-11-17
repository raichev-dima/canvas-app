import React from 'react';

import processInputFile from '../utils/processInputFile';
import './DataFileInput.css';

function DataFileInput() {
  const handleFileOpen = async e => {
    const [file] = e.target.files;

    const result = await processInputFile(file);
    // TODO
  };

  return (
    <div className="input-data-field">
      <label className="input-data-field__label" htmlFor="input-file">
        Choose data input file
      </label>
      <input
        className="input-data-field__input"
        type="file"
        id="input-file"
        accept=".txt"
        onChange={handleFileOpen}
      />
    </div>
  );
}

export default DataFileInput;
