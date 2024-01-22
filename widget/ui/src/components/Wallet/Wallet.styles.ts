import { darkTheme, styled } from '../../theme';
import { Typography } from '../Typography';

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
  width: 100,
  position: 'relative',
  fontFamily: 'inherit',
  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
  },
  '&:focus-visible': {
    $$color: '$colors$info100',
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
          $$outline: '$colors$secondary400',
        },
        outlineColor: '$$outline',
        outlineStyle: 'solid',
      },
    },
  },
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
