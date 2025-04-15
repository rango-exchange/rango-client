import { css, darkTheme, IconButton, styled } from '@rango-dev/ui';

export const Title = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ListContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  columnGap: '$5',
  rowGap: '$10',
  flexWrap: 'wrap',
  paddingTop: '$5',
  height: '100%',
});

export const WalletButton = styled('button', {
  borderRadius: '$xm',
  padding: '$10',
  border: '0',
  display: 'flex',
  justifyContent: 'center',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  alignItems: 'center',
  cursor: 'pointer',
  width: 110,
  position: 'relative',

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

export const ShowMoreWallets = styled(WalletButton, {
  alignSelf: 'stretch',
  minHeight: '93px',
});
export const ShowMoreHeader = styled('div', {
  padding: '$20 $20 $15 $20',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$neutral200',
  position: 'relative',
  width: '100%',
});

export const NavigateBack = styled(IconButton, {
  position: 'absolute',
  left: '$20',
});

export const WalletsContainer = styled('div', {
  paddingTop: '$20',
});

export const walletsListStyles = css({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  gap: '$10',
  flexWrap: 'wrap',
  paddingTop: '$5',
  height: '100%',
});

export const ConfirmButton = styled('div', {
  display: 'flex',
});

export const Wallets = styled('div', { overflow: 'visible', width: '100%' });
