import { keyframes } from '@stitches/react';
import React from 'react';
import { styled } from '../../theme';

const spin = keyframes({
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const SpinnerContainer = styled('div', {
  width: '$s',
  height: '$s',
  borderRadius: '50%',
  position: 'relative',
  border: `2px solid $neutral03`,
  borderRight: `2px solid $primary`,
  animation: `${spin} 1s linear infinite`,
  margin: `0px $m`,
});

function Spinner() {
  return <SpinnerContainer />;
}

export default Spinner;
