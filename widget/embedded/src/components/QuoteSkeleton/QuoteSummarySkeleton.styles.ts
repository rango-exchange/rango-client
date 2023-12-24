import { styled } from '@rango-dev/ui';

export const CostAndTag = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '22px',
});

export const Cost = styled('div', {
  display: 'flex',
});

export const BasicSummary = styled('div', {
  padding: '$15 $0 14px $0',
});

export const Output = styled('div', {
  padding: '$6 $0 $15 $0',
  display: 'flex',
  flexDirection: 'column',
});

export const OutputTokenInfo = styled('div', {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  paddingBottom: '$5',
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
