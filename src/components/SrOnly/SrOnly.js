import React from 'react';

import styles from './SrOnly.module.scss';

function SrOnly({ children }) {
  return <div className={styles.srOnly}>{children}</div>;
}

export default SrOnly;
