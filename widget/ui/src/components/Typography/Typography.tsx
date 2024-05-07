import type { TypographyPropTypes } from './Typography.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { TypographyContainer } from './Typography.styles';

export function Typography({
  children,
  className,
  color,
  ...props
}: PropsWithChildren<TypographyPropTypes>) {
  const customCss = color
    ? {
        color: color.startsWith('$') ? color : `$${color}`,
      }
    : {
        color: '$foreground',
      };
  return (
    <TypographyContainer
      className={`_typography _text ${className || ''}`}
      css={customCss}
      {...props}>
      {children}
    </TypographyContainer>
  );
}
