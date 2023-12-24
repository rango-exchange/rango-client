import { css, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  width: '100%',
  height: '100%',
  padding: '$10 $20',
});

export const StepContainer = styled('div', {
  backgroundColor: '$neutral100',
  borderRadius: '$xm',
  padding: '$10 $15',
});

export const StepSeparator = styled('div', {
  width: '0px',
  height: '$20',
  borderLeft: '1px dashed $neutral700',
  marginLeft: '25px',
});

export const quoteSummaryItemStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const tokenAmountStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const costStyles = css({
  paddingTop: '$15',
  display: 'flex',
});

export const quoteSummaryStyles = css({
  padding: '$15 $0',
});

export const quoteSummarySeparatorStyles = css({
  width: '0px',
  height: '$16',
  borderLeft: '1px solid $neutral400',
  marginLeft: '13px',
});

export const swapsStepsStyles = css({
  paddingBottom: '$10',
});

export const stepTitleStyles = css({
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
});

export const stepTokensStyles = css({
  paddingTop: '$5',
  display: 'flex',
  alignItems: 'center',
});

export const stepInfoStyles = css({
  display: 'flex',
  alignItems: 'center',
});

export const stepIconStyles = css({
  padding: '$4 $6',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const extraInfoStyles = css({
  display: 'flex',
  paddingTop: '$10',
  paddingBottom: '$5',
});
