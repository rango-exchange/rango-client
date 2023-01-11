import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';

const TypographyContainer = styled('p', {
  variants: {
    variant: {
      h1: {
        fontSize: '$h1',
        fontWeight: '$xl',
      },
      h2: {
        fontSize: '$xxxl',
        fontWeight: '$xl',
      },
      h3: {
        fontSize: '$xxl',
        fontWeight: '$xl',
      },
      h4: {
        fontSize: '$xl',
        fontWeight: '$l',
      },
      h5: {
        fontSize: '$l',
        fontWeight: '$l',
      },
      h6: {
        fontSize: '$m',
        fontWeight: '$l',
      },
      body1: {
        fontSize: '$l',
        fontWeight: '$m',
      },
      body2: {
        fontSize: '$l',
        fontWeight: '$s',
      },
    },
    align: {
      center: {
        textAlign: 'center',
      },
      left: {
        textAlign: 'left',
      },
      right: {
        textAlign: 'right',
      },
    },
    noWrap: {
      true: {
        whiteSpace: 'nowrap',
      },
    },
  },
});

export interface PropTypes {
  variant: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  align?: 'center' | 'left' | 'right';
  noWrap?: boolean;
}

function Typography({ children, ...props }: PropsWithChildren<PropTypes>) {
  return <TypographyContainer {...props}>{children}</TypographyContainer>;
}

export default Typography;
