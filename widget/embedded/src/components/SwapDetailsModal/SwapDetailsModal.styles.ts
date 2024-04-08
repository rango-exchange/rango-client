import { styled } from '@rango-dev/ui';

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
