import React from 'react';

import { DataFileInput, Preview, DownloadButton } from './components';

import './styles.css';

function App() {
  return (
    <div className="App">
      <h1>Canvas</h1>
      <form>
        <DataFileInput />
        <Preview />
        <DownloadButton />
      </form>
    </div>
  );
}

export default App;
