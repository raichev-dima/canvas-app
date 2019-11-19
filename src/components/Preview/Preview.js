import React from 'react';

import styles from './Preview.module.scss';

function Preview(props) {
  return (
    <div className={styles.preview__container}>
      <textarea className={styles.preview__area} readOnly={true} />
    </div>
  );
}

export default Preview;
