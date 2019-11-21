import React from 'react';

import styles from './SrOnly.module.scss';

function SrOnly({
  is: Component = 'div',
  isFocusable = false,
  className: classNameProp = '',
  ...rest
}) {
  const className = `${classNameProp}  ${
    isFocusable ? styles.srOnlyFocusable : styles.srOnly
  }`.trim();

  return <Component {...rest} className={className} />;
}

export default SrOnly;
