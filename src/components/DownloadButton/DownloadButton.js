import React from 'react';

import styles from './DownloadButton.module.scss';

function DownloadButton({ href }) {
  const Component = href ? 'a' : 'button';

  return (
    <div className={styles.download__container}>
      <Component
        href={href}
        type={!href && 'button'}
        className={styles.download__button}
        disabled={!href}
      >
        Download this canvas
      </Component>
    </div>
  );
}

export default DownloadButton;
