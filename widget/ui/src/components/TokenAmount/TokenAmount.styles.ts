import { css, styled } from '../../theme.js';
import { Typography } from '../Typography/Typography.js';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  variants: {
    direction: {
      vertical: {
        flexDirection: 'column',
        alignItems: 'start',
      },
      horizontal: { flexDirection: 'row', width: '100%', alignItems: 'end' },
    },
    centerAlign: {
      true: { alignItems: 'center', justifyContent: 'center' },
    },
  },
});

export const tokenAmountStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const usdValueStyles = css({
  display: 'flex',
  paddingTop: '$5',
});

export const tooltipRootStyle = {
  width: 'fit-content',
};

export const TokenNameText = styled(Typography, {
  maxWidth: '64px',
});

export const textTruncate = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  letterSpacing: 0.4,
  whiteSpace: 'nowrap',
});
