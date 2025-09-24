import { css, styled } from '../../theme.js';
import { ValueTypography } from '../PriceImpact/PriceImpact.styles.js';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  overflow: 'hidden',
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
  flex: '1 1 auto',
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
  [`& ${ValueTypography}`]: {
    minWidth: 0,
  },
});

export const tooltipRootStyle = {
  width: 'fit-content',
};

export const RealAmountWrapper = styled('div', {
  display: 'flex',
  gap: 2,
  minWidth: 0,
  alignItems: 'center',
  flex: '1 1 0%',
  '& svg': {
    flex: '0 0 auto',
  },
});

export const TokenNameWrapper = styled('div', {
  maxWidth: '78px',
  display: 'flex',
  gap: 2,
  minWidth: 0,
  flex: '0 1 auto',
  alignItems: 'center',
  '& svg': {
    flex: '0 0 auto',
  },
  '& .token-name-text': {
    maxWidth: '64px',
  },
});

export const textTruncate = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  display: 'block',
  whiteSpace: 'nowrap',
  minWidth: 0,
});

export const flexShrinkFix = css({
  minWidth: 0,
});

export const usdValueText = css({
  maxWidth: 88,
});

export const horizontalUsdValueText = css({
  '& .output-usd-value': {
    maxWidth: 88,
  },
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
  flex: 1,
  gap: 8,
});
