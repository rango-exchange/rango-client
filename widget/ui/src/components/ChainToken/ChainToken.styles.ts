import { styled } from '../../theme';
import { Image } from '../common';

export const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  [`& ${Image}`]: { borderRadius: '100%' },
});

export const ChainImageContainer = styled('div', {
  position: 'absolute',
  border: '0.5px solid $background',
  borderRadius: '100%',
  backgroundColor: '$background',
  variants: {
    size: {
      small: {
        right: '-3px',
        bottom: '-3px',
      },
      medium: {
        right: '0',
        bottom: '0',
      },
      large: {
        right: '-5px',
        bottom: '-5px',
      },
    },
  },
});
