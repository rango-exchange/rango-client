import { styled } from '@arlert-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const ErrorDescription = styled('div', {
  variants: {
    size: {
      small: {},
      large: {
        maxWidth: '316px',
      },
    },
  },
});

export const Footer = styled('div', {
  variants: {
    size: {
      small: {
        width: '100%',
      },
      large: {},
    },
  },
});

export const PrefixIcon = styled('div', {
  padding: '$6 $0',
});
