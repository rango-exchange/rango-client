import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';

const TypographyContainer = styled('p', {
  margin: 0,
  lineHeight: '24px',
  color: '$text1',
  variants: {
    variant: {
      h1: {
        fontSize: '$h1',
        fontWeight: '$xl',
        lineHeight: '48px',
      },
      h2: {
        fontSize: '$xxxl',
        fontWeight: '$xl',
        lineHeight: '48px',
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
      body3: {
        fontSize: '13px',
        fontWeight: '$s',
      },
      bodySmall: {
        fontSize: '$s',
        fontWeight: '$s',
        lineHeight: '20px',
      },
      legal: {
        fontWeight: '$m',
        fontSize: '11px',
        lineHeight: '20px',
      },
      footnote1: {
        fontWeight: '$s',
        fontSize: '11px',
        lineHeight: '20px',
      },
      footnote2: {
        fontWeight: '$s',
        fontSize: '$xs',
        lineHeight: '16px',
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
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'body3'
    | 'bodySmall'
    | 'footnote1'
    | 'footnote2'
    | 'legal';
  align?: 'center' | 'left' | 'right';
  noWrap?: boolean;
}

function Typography({ children, ...props }: PropsWithChildren<PropTypes>) {
  return <TypographyContainer {...props}>{children}</TypographyContainer>;
}

export default Typography;
