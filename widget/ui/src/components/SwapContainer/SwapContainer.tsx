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
  maxHeight: '100%',
  padding: '$16',
  boxSizing: 'border-box',
  backgroundColor: '$background',
});

export interface PropTypes {
  style?: CSSProperties;
}

export function SwapContainer(props: PropsWithChildren<PropTypes>) {
  const { children, style } = props;

  return (
    <MainContainer style={style} id="swap-box">
      {children}
    </MainContainer>
  );
}
