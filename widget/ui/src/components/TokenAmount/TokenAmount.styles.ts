import { styled } from '@stitches/react';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  variants: {
    direction: {
      vertical: {
        flexDirection: 'column',
        alignItems: 'start',
      },
      horizontal: { flexDirection: 'row', width: '100%', alignItems: 'end' },
    },
    centerAlign: {
      true: { alignItems: 'center', justifyContent: 'center' },
    },
  },
  '& .token-amount': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .usd-value': {
    display: 'flex',
    paddingTop: '$5',
  },
});
