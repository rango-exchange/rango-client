import { Button, IconButton, styled } from '@rango-dev/ui';

export const Link = styled('a', {
  color: '$neutral700',
  padding: 4,
  textDecoration: 'none',
  '&:hover': {
    color: '$secondary500',
  },
});

export const ButtonsContainer = styled('div', {
  borderRadius: '$sm',
  display: 'flex',
  width: '100%',
  justifyItems: 'center',
  alignItems: 'center',
  backgroundColor: '$neutral300',
});

export const ModalFlex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  [`& ${IconButton}`]: {
    padding: '$5',
  },
});

export const StyledButton = styled(Button, {
  flex: 'auto',
  textTransform: 'capitalize',
  borderRadius: '$xm',
  variants: {
    variant: {
      contained: {
        color: '$neutral600',
        backgroundColor: '$neutral300',
        '&:hover, &:focus': {
          color: '$secondary500',
          backgroundColor: '$info100',
        },
      },
    },
    type: {
      secondary: {
        color: '$background',
        backgroundColor: '$secondary500',
        '&:hover, &:focus': {
          color: '$background',
          backgroundColor: '$secondary500',
        },
      },
    },
  },
});

export const LinkContainer = styled('div', {
  padding: '$5',
});

export const Head = styled('div', {
  display: 'flex',
  padding: '$10 0',
  borderBottom: '1px solid $neutral300',
});

export const APIKeyInputContainer = styled('div', {
  width: '350px',
});

export const HelpLinksContainer = styled('div', {
  margin: 'auto',
  marginBottom: 'inherit',
  marginRight: 'inherit',
  display: 'flex',
});

export const ExternalLinkIconContainer = styled('span', {
  position: 'relative',
  display: 'inline-block',
  top: '1px',
});

export const StyledIconButton = styled(IconButton, {
  width: '48px',
  height: '48px',
});
