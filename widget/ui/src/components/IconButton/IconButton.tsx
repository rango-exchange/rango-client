import type { IconButtonPropTypes } from './IconButton.types.js';
import type { PropsWithChildren, Ref } from 'react';

import React from 'react';

import { Button } from '../Button/index.js';

// border-radius: 100% + overflow: hidden
function IconButtonComponent(
  props: PropsWithChildren<IconButtonPropTypes>,
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
