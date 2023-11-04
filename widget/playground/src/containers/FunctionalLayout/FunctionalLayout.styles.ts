import { Button, styled } from '@rango-dev/ui';

export const Layout = styled('div', {
  borderRadius: '20px',
  display: 'flex',
  padding: '$15',
  backgroundColor: '$background',
  width: '338px',
  height: '100%',
  flexDirection: 'column',
  position: 'relative',
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

export const FromToContainer = styled('div', {
  backgroundColor: '$background',
  borderRadius: '$sm',
  border: '1px solid $neutral300',
  padding: '$15 $20',
});

export const FromAmount = styled('div', {
  border: '1px solid $neutral300',
  borderRadius: '$xm',
  padding: '$2 $5',
  '&:hover': {
    borderColor: '$info300',
  },
});

export const IncludeSourceText = styled('div', {
  paddingLeft: '$24',
});
