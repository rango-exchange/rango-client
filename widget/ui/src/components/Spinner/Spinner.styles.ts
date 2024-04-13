import { keyframes, styled } from '../../theme';

const spin = keyframes({
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const SpinnerContainer = styled('div', {
  position: 'relative',
  animation: `${spin} 1.5s linear infinite`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
