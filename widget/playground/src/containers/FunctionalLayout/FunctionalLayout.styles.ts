import { css, styled } from '@rango-dev/ui';

export const amountStyles = css({
  fontSize: '$12',
});
export const connectButtonStyles = css({});

export const ExternalSection = styled('div', {
  borderRadius: '20px',
  padding: '$20',
  display: 'flex',
  flexDirection: 'column',
  placeContent: 'center',
  backgroundColor: '$background',
});

export const Footer = styled('div', {
  maxWidth: '$180',
  [`& .${connectButtonStyles}`]: {
    padding: '$5 $20',
  },
});

export const SwitchField = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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
  [`& .${amountStyles}`]: {
    color: '$neutral700',
    fontSize: '$12',
  },
  '&:hover': {
    borderColor: '$info300',
  },
});

export const IncludeSourceText = styled('div', {
  paddingLeft: '$24',
});
