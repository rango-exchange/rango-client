import { darkTheme, styled } from '@arlert-dev/ui';

export const WalletContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
});

export const TooltipErrorContent = styled('div', {
  maxWidth: 280,
  '& ._typography': {
    wordWrap: 'break-word',
    display: 'block',
  },
});

export const ProfileBanner = styled('img', {
  width: '100%',
});

export const WalletIcon = styled('div', {
  position: 'relative',
});

export const WalletIconBadgeContainer = styled('span', {
  position: 'absolute',
  top: 0,
  right: 0,
  borderRadius: '50%',
  width: '14px',
  height: '14px',
  display: 'flex',
  padding: '$2',
  backgroundColor: '$warning300',
  [`.${darkTheme} &`]: {
    $$color: '$warning600',
  },
});
