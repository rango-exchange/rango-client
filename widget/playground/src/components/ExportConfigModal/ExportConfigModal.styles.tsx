import { Button, IconButton, styled } from '@rango-dev/ui';

export const Link = styled('a', {
  color: '$neutral700',
  padding: 4,
  textDecoration: 'none',
  '&:hover': {
    color: '$secondary500',
    '& .icon_container > svg': {
      color: '$secondary500',
    },
  },
});

export const ButtonsContainer = styled('div', {
  borderRadius: '$sm',
  display: 'flex',
  width: '100%',
  justifyItems: 'center',
  alignItems: 'center',
  backgroundColor: '$neutral300',
  position: 'relative',
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
        zIndex: 10,
        transition: 'color 0.8s linear',
        color: '$background',
        backgroundColor: 'transparent',
        '&:hover, &:focus': {
          color: '$background',
          backgroundColor: 'transparent',
        },
      },
    },
  },
});

export const BackdropTab = styled('div', {
  width: '362px',
  height: '$40',
  backgroundColor: '$secondary500',
  position: 'absolute',
  borderRadius: '$xm',
  inset: 0,
  transition: 'transform 0.5s ease-in-out',
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
