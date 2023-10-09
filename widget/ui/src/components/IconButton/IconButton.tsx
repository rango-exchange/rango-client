import type { PropTypes } from './IconButton.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Button } from '../Button';

// border-radius: 100% + overflow: hidden
function IconButton(props: PropsWithChildren<PropTypes>) {
  const { style, ...otherProps } = props;
  return (
    <Button
      className="_icon-button"
      {...otherProps}
      style={{
        borderRadius: '100%',
        lineHeight: 0,
        ...style,
      }}>
      {props.children}
    </Button>
  );
}

IconButton.toString = () => '._icon-button';

export { IconButton };
