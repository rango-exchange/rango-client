import { css, styled } from '@rango-dev/ui';

export const FlexContent = styled('div', {
  display: 'flex',
});

export const BasicSummary = styled('div', {
  padding: '$10 $0 $20',
});

export const Output = styled('div', {
  padding: '$12 $0 $20 $0',
  display: 'flex',
  flexDirection: 'column',
});

export const OutputTokenInfo = styled('div', {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
});

export const QuoteSummary = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'end',
});

export const QuoteSummarySeparator = styled('div', {
  height: '$28',
  marginLeft: '13px',
  borderLeft: '1px solid $neutral700',
});

export const TokenAmount = styled('div', {
  width: '65%',
  display: 'flex',
  justifyContent: 'start',
});

export const TokenAmountLabel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  flexGrow: 1,
  maxWidth: '148px',
});

export const SwapPreview = styled('div', { padding: '$15 $0 $15 $0' });

export const RowStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
