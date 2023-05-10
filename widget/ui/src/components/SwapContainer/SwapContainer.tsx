import { CSSProperties } from '@stitches/react';
import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';

const MainContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '$10',
  boxShadow: '$s',
  width: '100%',
  minWidth: '375px',
  maxWidth: '512px',
  padding: '$16',
  boxSizing: 'border-box',
  backgroundColor: '$background',
  overflow: 'hidden',
  '& *': {
    boxSizing: 'border-box',
    listStyleType: 'none',
    '&::-webkit-scrollbar': { width: '$8', height: '$8' },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '$neutral400',
      borderRadius: '$10',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '$neutral500',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '$neutral100',
    },
  },
  variants: {
    fixedHeight: {
      true: {
        height: '595px',
        maxHeight: '595px',
      },
      false: {
        height: 'auto',
      },
    },
  },
});

export interface PropTypes {
  style?: CSSProperties;
  fixedHeight?: boolean;
}

export function SwapContainer(props: PropsWithChildren<PropTypes>) {
  const { children, style, fixedHeight = true } = props;
  return (
    <MainContainer style={style} id="swap-box" fixedHeight={fixedHeight}>
      {children}
    </MainContainer>
  );
}
