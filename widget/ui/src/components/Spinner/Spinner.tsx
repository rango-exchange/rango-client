import React from 'react';
import { keyframes, styled } from '../../theme';

const spin = keyframes({
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const SpinnerContainer = styled('div', {
  width: '$4',
  height: '$4',
  borderRadius: '50%',
  position: 'relative',
  border: `2px solid $neutral-300`,
  borderRight: `2px solid $primary-500`,
  animation: `${spin} 1s linear infinite`,
  margin: `0px $m`,
});

function Spinner() {
  return <SpinnerContainer />;
}

export default Spinner;
