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

export const TokenAmountWrapper = styled('div', {
  flex: '1 1 0',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  variants: {
    direction: {
      vertical: {
        maxWidth: 320,
      },
      horizontal: { maxWidth: 254 },
    },
  },
});

export const usdValueStyles = css({
  display: 'flex',
  paddingBottom: '$5',
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

export const flexShrinkFix = css({
  minWidth: 0,
});

export const usdValueText = css({
  '& .output-usd-value': {
    maxWidth: 77,
  },
  maxWidth: 88,
});
export const verticalUsdValueText = css({
  '& .output-usd-value': {
    maxWidth: 300,
  },
  maxWidth: 320,
});

export const flexShrink = css({
  flexShrink: 1,
});

export const TokenInfoRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});
