import { CSSProperties } from '@stitches/react';
import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';

const MainContainer = styled('div', {
  borderRadius: '$10',
  maxWidth: '512px',
  boxShadow: '$s',
  minWidth: '375px',
  width: '100%',
  backgroundColor: '$background',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  padding: '$16 $24',
  boxSizing: 'border-box',
});

const ContentContainer = styled('div', {
  width: '100%',
  // maxHeight: '600px',
});

export interface PropTypes {
  style?: CSSProperties;
}

export function SwapContainer(props: PropsWithChildren<PropTypes>) {
  const { children, style } = props;

  return (
    <MainContainer style={style}>
      <ContentContainer>{children}</ContentContainer>
    </MainContainer>
  );
}
