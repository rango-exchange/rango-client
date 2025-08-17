import { css, styled } from '../../theme.js';
import { Typography } from '../Typography/Typography.js';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '$8',
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

export const centeredFlexBox = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const tokenAmountStyles = css({
  maxWidth: 254,
  flex: '1 1 0',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

export const usdValueStyles = css({
  display: 'flex',
  paddingTop: '$5',
  minWidth: 0,
  flex: '0 1 auto',
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
  whiteSpace: 'nowrap',
});
