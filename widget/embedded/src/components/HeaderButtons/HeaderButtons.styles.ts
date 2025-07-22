import { css, darkTheme, IconButton, styled } from '@arlert-dev/ui';

export const HeaderButton = styled(IconButton, {
  width: '$24',
  position: 'relative',
  padding: '0',
  overflow: 'unset',
  '&:hover': {
    backgroundColor: '$secondary100',
    [`.${darkTheme} &`]: {
      backgroundColor: '$neutral',
    },
  },
});

export const ConnectedIcon = styled('div', {
  position: 'absolute',
  background: '$secondary500',
  [`.${darkTheme} &`]: {
    $$color: '$colors$secondary250',
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
  width: '14px',
  height: '14px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '7px',
  top: '$0',
  right: '$0',
  variants: {
    isSever: {
      true: {
        backgroundColor: '$error500',
      },
      false: {
        backgroundColor: '$secondary500',
      },
    },
  },
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

export const InProgressTransactionBadgeContainer = styled('div', {
  position: 'absolute',
  right: '$4',
  top: '$4',
  backgroundColor: '$background',
  borderRadius: '100%',
});

export const rowStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

export const WalletImageContainer = styled('div', {
  borderRadius: '100%',
  border: '1.5px transparent solid',
  '&:not(:first-child)': {
    marginLeft: '-$6',
  },
  img: {
    borderRadius: '100%',
  },
});
