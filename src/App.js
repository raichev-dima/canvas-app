import React from 'react';

import { DataFileInput, Preview, DownloadButton } from './components';

import './styles.scss';

import styles from './App.module.scss';

const FORM_ID = 'file-input-form';

function App() {
  return (
    <main>
      <h1>Canvas</h1>
      <form id={FORM_ID} className={styles.inputForm}>
        <DataFileInput />
        <DownloadButton />
        <Preview />
      </form>
    </main>
  );
}

export default App;
