import React from 'react';

import { DataFileInput, Preview, DownloadButton } from './components';
import ErrorBoundary from './ErrorBoundary';
import styles from './App.module.scss';

import './styles.scss';

const FORM_ID = 'file-input-form';

function App() {
  return (
    <ErrorBoundary>
      <main>
        <h1>Canvas App</h1>
        <form id={FORM_ID} className={styles.inputForm}>
          <DataFileInput />
          <DownloadButton />
          <Preview />
        </form>
      </main>
    </ErrorBoundary>
  );
}

export default App;
