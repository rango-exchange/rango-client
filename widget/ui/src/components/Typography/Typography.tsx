import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';

const TypographyContainer = styled('p', {
  margin: 0,
  color: '$text1',
  variants: {
    variant: {
      h1: {
        fontSize: '$48',
        fontWeight: '$700',
      },
      h2: {
        fontSize: '$40',
        fontWeight: '$700',
      },
      h3: {
        fontSize: '$32',
        fontWeight: '$700',
      },
      h4: {
        fontSize: '$24',
        fontWeight: '$600',
      },
      h5: {
        fontSize: '$20',
        fontWeight: '$600',
      },
      h6: {
        fontSize: '$18',
        fontWeight: '$500',
      },
      body1: {
        fontSize: '$18',
        fontWeight: '$400',
      },
      body2: {
        fontSize: '$16',
        fontWeight: '$400',
      },
      caption: {
        fontSize: '$12',
        fontWeight: '$400',
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
    | 'body1'
    | 'body2'
    | 'caption';
  align?: 'center' | 'left' | 'right';
  noWrap?: boolean;
  mt?: 2 | 4 | 8 | 12;
  mb?: 2 | 4 | 8 | 12;
  ml?: 2 | 4 | 8 | 12;
  mr?: 2 | 4 | 8 | 12;
}

function Typography({ children, ...props }: PropsWithChildren<PropTypes>) {
  return <TypographyContainer {...props}>{children}</TypographyContainer>;
}

export default Typography;
