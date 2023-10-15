import { Button, styled } from '@rango-dev/ui';

export const Layout = styled('div', {
  borderRadius: '20px',
  display: 'flex',
  padding: '$15',
  backgroundColor: '$background',
  width: '338px',
  height: '100%',
  flexDirection: 'column',
});

export const ExternalSection = styled('div', {
  borderRadius: '20px',
  padding: '$20',
  display: 'flex',
  flexDirection: 'column',
  placeContent: 'center',
  backgroundColor: '$background',
  '& .footer': {
    maxWidth: '$180',
  },
});

export const SwitchField = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const StyledButton = styled(Button, {
  variants: {
    variant: {
      outlined: {
        padding: '$5 $20',
      },
    },
  },
});
