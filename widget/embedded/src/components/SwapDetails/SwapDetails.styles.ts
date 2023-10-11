import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  height: '0',
  flexGrow: 1,
  '& .row': {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '$10 $5',
    borderBottom: '1px solid $neutral300',
    color: '$neutral500',
  },
  '& .request-id': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '$24',
  },
  '& .output': {
    display: 'flex',
    width: '100%',
    padding: '$15 $20 $20',
    flexDirection: 'column',
    alignItems: 'start',
  },
  '& .title-steps': {
    textAlign: 'left',
    width: '100%',
    padding: '0 $20 $10',
  },
});

export const HeaderDetails = styled('div', {
  width: '100%',
  padding: '0px 15px',
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
