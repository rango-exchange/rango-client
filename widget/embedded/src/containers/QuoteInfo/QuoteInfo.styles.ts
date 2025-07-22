import { styled } from '@arlert-dev/ui';

export const QuoteContainer = styled('div', {
  width: '100%',
  '& .position-top__skeleton': {
    paddingTop: '$10',
  },
});
export const FooterStepAlarm = styled('div', {
  paddingBottom: '$15',
  variants: {
    dense: {
      true: {
        paddingBottom: 0,
      },
    },
  },
});

export const FooterAlert = styled('div', {
  width: '100%',
  display: 'flex',
});
