import React from 'react';

import { DataFileInput, Preview, DownloadButton } from './components';
import ErrorBoundary from './ErrorBoundary';
import AppProvider from './AppProvider';
import styles from './App.module.scss';

import './styles.scss';

const FORM_ID = 'file-input-form';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <main>
          <h1>Canvas App</h1>
          <form id={FORM_ID} className={styles.inputForm}>
            <DataFileInput />
            <DownloadButton />
            <Preview />
          </form>
        </main>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
