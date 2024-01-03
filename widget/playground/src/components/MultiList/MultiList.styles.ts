import { ListItemButton, styled, Typography } from '@yeager-dev/ui';

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
  cursor: 'pointer',
  textTransform: 'capitalize',
});

export const SelectDeselectText = styled(Typography, {
  variants: {
    disabled: {
      true: {},
      false: {
        '&:hover': {
          color: '$secondary500',
        },
      },
    },
  },
});
export const CheckList = styled('div', {
  overflow: 'auto',
  height: '90%',
  paddingRight: '$5',
  marginBottom: '$32',
});
export const ItemDivider = styled('li', {
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

export const StyledListItemButton = styled(ListItemButton, {
  height: '$46',
});
