import { css, IconButton, SelectableWalletButton, styled } from '@arlert-dev/ui';

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

export const ShowMoreWallets = styled(SelectableWalletButton, {
  justifyContent: 'center',
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
