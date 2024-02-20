import { styled } from '@rango-dev/ui';

export const LiquiditySourceList = styled('ul', {
  padding: '$15 $5 0',
  margin: 0,
  listStyle: 'none',
  height: '100%',
  overflowY: 'auto',
  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});

export const LiquiditySourceSuffix = styled('div', {
  width: 80,
  display: 'flex',
  justifyContent: 'flex-end',
});

export const NotFoundContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});
