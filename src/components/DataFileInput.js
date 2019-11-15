import React from 'react';

import './DataFileInput.css';

function DataFileInput() {
  const handleFileOpen = e => {
    const [file] = e.target.files;

    const reader = new FileReader();

    reader.onload = function() {
      // TODO
      // const text = reader.result;
    };

    reader.readAsText(file);
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
