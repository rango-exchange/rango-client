import { darkTheme, styled } from '../../theme.js';
import { Typography } from '../Typography/index.js';

export const WalletImageContainer = styled('div', {
  '& img': {
    borderRadius: '50%',
  },
});

export const Title = styled(Typography, {
  textTransform: 'capitalize',
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
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  alignItems: 'center',
  cursor: 'pointer',
  width: 108,
  position: 'relative',
  fontFamily: 'inherit',
  '&:hover': {
    $$color: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
  },
  '&:focus-visible': {
    $$color: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$info700',
    },
    backgroundColor: '$$color',
    outline: 0,
  },
  '&:disabled': {
    filter: 'grayscale(1)',
    pointerEvents: 'none',
  },
  variants: {
    selected: {
      true: {
        outlineWidth: 1,
        $$outline: '$colors$secondary500',
        [`.${darkTheme} &`]: {
          $$outline: '$colors$secondary250',
        },
        outlineColor: '$$outline',
        outlineStyle: 'solid',
      },
    },
  },
});

export const SelectableWalletButton = styled(WalletButton, {
  width: 'auto',
  paddingRight: '$6',
  paddingLeft: '$6',
  flex: 1,
  minWidth: '98px',
  maxWidth: '110px',
  minHeight: '93px',
});

export const LoadingButton = styled('div', {
  borderRadius: '$xm',
  padding: '$10 0',
  border: '0',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$neutral100',
  alignItems: 'center',
  justifyContent: 'center',
  width: 100,
});
