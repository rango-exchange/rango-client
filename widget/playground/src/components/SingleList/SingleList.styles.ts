import { Button, styled } from '@yeager-dev/ui';

export const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& .header': {
    display: 'flex',
    alignItems: 'center',
  },
});

export const RadioList = styled('div', {
  height: '100%',
});

export const IconWrapper = styled('div', {
  width: '$24',
  height: '$24',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StyledButton = styled(Button, {
  position: 'absolute',
  bottom: 10,
  width: '100%',
});

export const EmptyContainer = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
