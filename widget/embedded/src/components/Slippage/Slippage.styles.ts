import { Chip, styled, TextField } from '@rango-dev/ui';

export const BaseContainer = styled('div', {
  paddingTop: '$5',
  padding: '$10 $5',
});

export const SlippageChipsContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$10',
  [`& ${TextField}`]: {
    flex: '1 1 0',
    maxWidth: '127px',
    minWidth: '85px',
  },
});

export const Head = styled('div', {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  paddingBottom: '$10',
});

export const SlippageTooltipContainer = styled('div', {
  maxWidth: '280px',
  padding: '$10',
});

export const SlippageChip = styled(Chip, {
  width: '61px',
  flexShrink: 0,
});

export const SlippageTextFieldContainer = styled('div', {
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: '$xs',
  flex: 1,
  variants: {
    status: {
      safe: {
        borderColor: '$secondary500',
      },
      error: {
        borderColor: '$error500',
      },
      warning: {
        borderColor: '$warning500',
      },
      empty: {
        borderWidth: 0,
      },
    },
  },
});
