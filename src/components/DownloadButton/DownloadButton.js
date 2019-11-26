import React from 'react';

import styles from './DownloadButton.module.scss';
import { useAppState } from '../../AppProvider';

function DownloadButton() {
  const { url: href } = useAppState();
  const Component = href ? 'a' : 'button';

  return (
    <div className={styles.download__container}>
      <Component
        href={href}
        type={!href ? 'button' : null}
        className={styles.download__button}
        download={href ? 'output' : null}
        disabled={!href}
      >
        Download this canvas
      </Component>
    </div>
  );
}

export default DownloadButton;
