import type { TypographyPropTypes } from './Typography.types.js';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { TypographyContainer } from './Typography.styles.js';

export const Typography = React.forwardRef<
  HTMLSpanElement,
  PropsWithChildren<TypographyPropTypes>
>((props, ref) => {
  const { children, id, className, color, ...rest } = props;

  const customCss = color
    ? { color: color.startsWith('$') ? color : `$${color}` }
    : { color: '$foreground' };

  return (
    <TypographyContainer
      id={id}
      className={`_typography _text ${className || ''}`}
      css={customCss}
      ref={ref}
      {...rest}>
      {children}
    </TypographyContainer>
  );
});

Typography.displayName = 'Typography';
