import { styled } from '@rango-dev/ui';

export const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& .header': {
    display: 'flex',
    alignItems: 'center',
  },
});
export const SelectButton = styled('div', {
  padding: '$4',
  display: 'flex',
  justifyContent: 'flex-end',
});
export const WalletList = styled('div', {
  overflow: 'auto',
  height: '552px',
});
export const WalletDivider = styled('li', {
  margin: '0 auto',
  width: '100%',
  height: '1px',
  backgroundColor: '$neutral300',
});

export const IconWrapper = styled('div', {
  width: '$24',
  height: '$24',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
