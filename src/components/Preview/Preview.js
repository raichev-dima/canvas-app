import React from 'react';

import styles from './Preview.module.scss';
import Spinner from '../Spinner/Spinner';

const spinnerPosition = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

function Preview(props) {
  return (
    <div className={styles.preview__container}>
      <Spinner style={spinnerPosition} />
      <textarea className={styles.preview__area} readOnly={true} />
    </div>
  );
}

export default Preview;
