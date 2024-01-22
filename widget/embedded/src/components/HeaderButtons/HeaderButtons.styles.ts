import { darkTheme, IconButton, styled } from '@rango-dev/ui';

export const HeaderButton = styled(IconButton, {
  width: '$24',
  position: 'relative',
  padding: '0',
  overflow: 'unset',
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

export const SuffixContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  minWidth: '$40',
  button: {
    padding: 0,
  },
});

export const NotificationsBadgeContainer = styled('div', {
  position: 'absolute',
  backgroundColor: '$secondary500',
  width: '14px',
  height: '14px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '7px',
  top: '$0',
  right: '$0',
});

export const ProgressIcon = styled('div', {
  padding: '$2',
  variants: {
    isRefetched: {
      true: {
        transform: `rotate(360deg)`,
        transition: 'transform 1s ease-in-out',
      },
    },
  },
});
