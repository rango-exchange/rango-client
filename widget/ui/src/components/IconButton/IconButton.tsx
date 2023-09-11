import type { PropTypes } from './IconButton.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Button } from '../Button';

// border-radius: 100% + overflow: hidden
function IconButton(props: PropsWithChildren<PropTypes>) {
  return (
    <Button
      {...props}
      style={{
        borderRadius: '100%',
        lineHeight: 0,
      }}>
      {props.children}
    </Button>
  );
}

export { IconButton };
