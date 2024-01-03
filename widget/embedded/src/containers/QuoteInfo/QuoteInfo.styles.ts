import { styled } from '@yeager-dev/ui';

export const PositionTopAlerts = styled('div', {
  paddingBottom: '$10',
});

export const QuoteContainer = styled('div', {
  width: '100%',
  '& .position-top__skeleton': {
    paddingTop: '$10',
  },
});

export const SkeletonContainer = styled('div', {
  variants: {
    paddingTop: {
      true: {
        paddingTop: '$10',
      },
    },
  },
});

export const FooterStepAlarm = styled('div', {
  paddingBottom: '$15',
});

export const FooterAlert = styled('div', {
  width: '100%',
  display: 'flex',
});
