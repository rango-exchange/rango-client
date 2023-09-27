import { Button, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
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

export const Separator = styled('div', {
  height: '$12',
  marginRight: '$10',
  borderLeft: '1px solid $neutral900',
  marginLeft: '$14',
});

export const HeaderDetails = styled('div', {
  width: '100%',
  padding: '0px 15px',
});

export const StepsList = styled('div', {
  padding: '0 $20 $20',
  width: '100%',
  height: '320px',
  overflow: 'auto',
  variants: {
    shouldRetry: {
      true: {
        height: '280px',
      },
    },
  },
});

export const StyledButton = styled(Button, {
  position: 'absolute',
  bottom: '$80',
  width: '350px',
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
  textAlign: 'center',
});

export const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  paddingTop: '33%',
  flex: 1,
});
