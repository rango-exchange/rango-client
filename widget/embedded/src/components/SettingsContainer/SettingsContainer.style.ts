import { styled } from '@rango-dev/ui';

export const SettingsContainer = styled('div', {
  height: '100%',
});

export const LiquiditySourceList = styled('ul', {
  padding: '$15 $5 0',
  margin: 0,
  listStyle: 'none',
  height: '100%',
  overflowY: 'visible',
});

export const LiquiditySourceDivider = styled('li', {
  margin: '0 auto',
  width: '100%',
  height: '1px',
  backgroundColor: '$neutral300',
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
