import { styled } from '../../theme';

export const WalletImageContainer = styled('div', {
  '& img': {
    borderRadius: '50%',
  },
});

export const Text = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '$10',
});

export const WalletButton = styled('button', {
  borderRadius: '$xm',
  padding: '$10',
  border: '0',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$neutral200',
  alignItems: 'center',
  cursor: 'pointer',
  width: 110,
  position: 'relative',
  '&:hover': {
    backgroundColor: '$surface600',
    opacity: '0.8',
  },
  variants: {
    selected: {
      true: {
        outlineWidth: 1,
        outlineColor: '$secondary',
        outlineStyle: 'solid',
      },
    },
  },
});
