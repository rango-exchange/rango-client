import type { PropTypes } from './IconButton.types';
import type { PropsWithChildren, Ref } from 'react';

import React from 'react';

import { Button } from '../Button';

// border-radius: 100% + overflow: hidden
function IconButtonComponent(
  props: PropsWithChildren<PropTypes>,
  ref: Ref<HTMLButtonElement>
) {
  const { style, ...otherProps } = props;
  return (
    <Button
      className="_icon-button"
      ref={ref}
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

const IconButton = React.forwardRef(IconButtonComponent);
IconButton.displayName = 'IconButton';
IconButton.toString = () => '._icon-button';

export { IconButton };
