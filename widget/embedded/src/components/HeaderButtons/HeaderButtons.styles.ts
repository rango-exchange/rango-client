import { Button, darkTheme, styled } from '@rango-dev/ui';

export const HeaderButton = styled(Button, {
  width: '24px',
  padding: '0',
  position: 'relative',
});

export const ConnectedIcon = styled('div', {
  position: 'absolute',
  background: '$secondary500',
  [`.${darkTheme} &`]: {
    $$color: '$colors$secondary400',
  },
  width: '$6',
  height: '$6',
  borderRadius: '$lg',
  right: '$4',
  border: '1px solid $surface100',
});
