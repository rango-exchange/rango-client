import { IconButton, styled } from '@arlert-dev/ui';

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

export const TabsContainer = styled('div', {
  height: '$40',
});

export const ModalFlex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  [`& ${IconButton}`]: {
    padding: '$5',
  },
});

export const LinkContainer = styled('div', {
  padding: '$5',
});

export const Head = styled('div', {
  display: 'flex',
  padding: '$10 0',
  borderBottom: '1px solid $neutral300',
  borderTop: '1px solid $neutral300',
});

export const APIKeyInputContainer = styled('div', {
  width: '350px',
  backgroundColor: '$neutral100',
  padding: '$5 $10',
  borderRadius: '$sm',
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
export const Label = styled('span', {
  display: 'flex',
});
