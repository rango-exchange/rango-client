import { styled } from '@arlert-dev/ui';

export const Alerts = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$10',
});

export const ActionIcon = styled('div', {
  transition: 'transform 0.3s ease-in-out',
  variants: {
    rotated: {
      true: {
        transform: 'rotate(180deg)',
      },
    },
  },
});

export const AlertFooter = styled('div', {
  transition: 'max-height 0.3s ease-in-out',
  maxHeight: '0px',
  overflow: 'hidden',
  variants: {
    open: {
      true: {
        maxHeight: '200px',
      },
    },
  },
});
