/* istanbul ignore file */
import React from 'react';

import styles from './ProgressBar.module.scss';

function ProgressBar({ progress }) {
  return (
    <div className={styles.progress}>
      <div style={{ width: `${progress}%`, transition: 'width 300ms' }} />
    </div>
  );
}

export default ProgressBar;
