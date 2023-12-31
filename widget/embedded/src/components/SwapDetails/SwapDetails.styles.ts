import { css, darkTheme, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  height: '0',
  flexGrow: 1,
});

export const HeaderDetails = styled('div', {
  width: '100%',
});

export const StepsList = styled('div', {
  padding: '$0 $20 $20 $20',
  width: '100%',
  overflow: 'auto',
});
export const Alerts = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$10',
});

export const PlaceholderContainer = styled('div', {
  height: '450px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  paddingTop: '33%',
  flex: 1,
});

export const rowStyles = css({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$10 $20',
  borderBottom: '1px solid',
  $$color: '$colors$neutral300',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral400',
  },
  borderColor: '$$color',
  color: '$neutral500',
});

export const requestIdStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '$24',
});

export const outputStyles = css({
  display: 'flex',
  width: '100%',
  padding: '$15 $20 $20',
  flexDirection: 'column',
  alignItems: 'start',
});

export const titleStepsStyles = css({
  width: '100%',
  padding: '0 $20 $10',
});
