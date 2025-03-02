import { styled } from '@rango-dev/ui';

export const SupportedChainsContainer = styled('ul', {
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  margin: 0,
});

export const SupportedChainItem = styled('li', {
  marginLeft: '-5px',
  listStyleType: 'none',
  backgroundColor: '$background',
  borderRadius: '$lg',
  width: '15px',
  height: '15px',
  variants: {
    firstItem: {
      true: { marginLeft: 0 },
    },
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
