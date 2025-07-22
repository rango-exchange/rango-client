import { styled } from '@arlert-dev/ui';

export const SupportedChainsContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  margin: 0,
});

export const SupportedChainItem = styled('div', {
  marginLeft: '-5px',
  listStyleType: 'none',
  backgroundColor: '$background',
  borderRadius: '$lg',
  minWidth: '15px',
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
