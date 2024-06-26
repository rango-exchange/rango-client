import { darkTheme, styled } from '../../theme';
import { Typography } from '../Typography';

export const Container = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
});

export const OutputUsdValue = styled(Typography, {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: '$neutral600',
  [`.${darkTheme} &`]: {
    color: '$neutral700',
  },
});

export const PercentageChange = styled(Typography, {
  color: '$neutral600',
  [`.${darkTheme} &`]: {
    color: '$neutral700',
  },

  variants: {
    hasWarning: {
      true: {
        color: '$warning500',
      },
    },
    hasError: {
      true: {
        color: '$error500',
      },
    },
  },
});
