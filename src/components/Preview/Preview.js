import React from 'react';

import styles from './Preview.module.scss';
import Spinner from '../Spinner/Spinner';
import { useAppState } from '../../AppProvider';

const spinnerPosition = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const Error = ({ children }) => <p style={{ color: 'red' }}>{children}</p>;

function Preview() {
  const state = useAppState();

  const { loading = false, snapshot = 'There is no data yet', error } = state;

  return (
    <div className={styles.preview__container}>
      {loading && <Spinner style={spinnerPosition} />}
      <div className={styles.preview__area}>
        {error ? <Error>{error}</Error> : <pre>{snapshot}</pre>}
      </div>
    </div>
  );
}

export default Preview;
