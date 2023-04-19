import { CSSProperties } from '@stitches/react';
import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';

const TypographyContainer = styled('p', {
  margin: 0,
  display: 'inline-block',
  variants: {
    variant: {
      h1: {
        fontSize: '$36',
        fontWeight: '$700',
        '@md': {
          fontSize: '$40',
        },
        '@lg': {
          fontSize: '$48',
        },
      },
      h2: {
        fontSize: '$32',
        fontWeight: '$700',
        '@md': {
          fontSize: '$36',
        },
        '@lg': {
          fontSize: '$40',
        },
      },
      h3: {
        fontSize: '$20',
        fontWeight: '$700',
        '@md': {
          fontSize: '$24',
        },
        '@lg': {
          fontSize: '$32',
        },
      },
      h4: {
        fontSize: '$18',
        fontWeight: '$600',
        '@md': {
          fontSize: '$20',
        },
        '@lg': {
          fontSize: '$24',
        },
      },
      h5: {
        fontSize: '$16',
        fontWeight: '$600',
      },
      h6: {
        fontSize: '$14',
        fontWeight: '$500',
        '@md': {
          fontSize: '$16',
        },
        '@lg': {
          fontSize: '$18',
        },
      },
      title: {
        fontSize: '$14',
        fontWeight: '$500',
        '@md': {
          fontSize: '$15',
        }
      },
      body1: {
        fontSize: '$14',
        fontWeight: '$400',
        '@md': {
          fontSize: '$16',
        },
        '@lg': {
          fontSize: '$18',
        },
      },
      body2: {
        fontSize: '$14',
        fontWeight: '$400',
        // '@lg': {
        //   fontSize: '$14',
        // },
      },
      body3: {
        fontSize: '$12',
        fontWeight: '$400',
      },
      caption: {
        fontSize: '$10',
        fontWeight: '$400',
        '@lg': {
          fontSize: '$12',
        },
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
    ml: {
      2: {
        marginLeft: '$2',
      },
      4: {
        marginLeft: '$4',
      },
      8: {
        marginLeft: '$8',
      },
      12: {
        marginLeft: '$12',
      },
    },
    mt: {
      2: {
        marginTop: '$2',
      },
      4: {
        marginTop: '$4',
      },
      8: {
        marginTop: '$8',
      },
      12: {
        marginTop: '$12',
      },
    },
    mr: {
      2: {
        marginRight: '$2',
      },
      4: {
        marginRight: '$4',
      },
      8: {
        marginRight: '$8',
      },
      12: {
        marginRight: '$12',
      },
    },
    mb: {
      2: {
        marginBottom: '$2',
      },
      4: {
        marginBottom: '$4',
      },
      8: {
        marginBottom: '$8',
      },
      12: {
        marginBottom: '$12',
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
    | 'title'
    | 'body1'
    | 'body2'
    | 'body3'
    | 'caption';
  align?: 'center' | 'left' | 'right';
  noWrap?: boolean;
  mt?: 2 | 4 | 8 | 12;
  mb?: 2 | 4 | 8 | 12;
  ml?: 2 | 4 | 8 | 12;
  mr?: 2 | 4 | 8 | 12;
  className?: string;
  style?: CSSProperties;
  color?: string;
}

export function Typography({
  children,
  className,
  color,
  ...props
}: PropsWithChildren<PropTypes>) {
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
      {...props}
    >
      {children}
    </TypographyContainer>
  );
}

Typography.toString = () => '._typography';
