import { darkTheme, styled } from '../../theme';

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
  backgroundColor: '$neutral100',
  alignItems: 'center',
  cursor: 'pointer',
  width: 110,
  position: 'relative',
  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral400',
    },
    backgroundColor: '$$color',
  },
  variants: {
    selected: {
      true: {
        outlineWidth: 1,
        outlineColor: '$secondary500',
        outlineStyle: 'solid',
      },
    },
  },
});
