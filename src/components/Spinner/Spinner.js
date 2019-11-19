import React from 'react';

import styles from './Spinner.module.scss';

function Spinner(props) {
  const elements = Array(12).fill(1);
  const rotateStart = 0;
  const delayStart = -1.1;

  return (
    <div className={styles.spinner} {...props}>
      {elements.map((_, i) => {
        const style = {
          transform: `rotate(${rotateStart + i * 30}deg)`,
          animationDelay: `${delayStart + i * 0.1}s`,
        };
        return <div key={i} style={style} />;
      })}
    </div>
  );
}

export default Spinner;
