import React from 'react';

import styles from './DownloadButton.module.scss';

function DownloadButton(props) {
  return (
    <div className={styles.download__container}>
      <a href="/" className={styles.download__button}>
        Download this canvas
      </a>
    </div>
  );
}

export default DownloadButton;
