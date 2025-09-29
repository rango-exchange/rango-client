import { Button, darkTheme, styled, Typography } from '@rango-dev/ui';

export const StyledLink = styled('a', {
  textDecoration: 'none',
  color: '$colors$neutral700',
  [`.${darkTheme} &`]: {
    color: '$colors$neutral900',
  },

  '& svg': {
    marginLeft: '$4',
    color: '$colors$neutral700',
    [`.${darkTheme} &`]: {
      color: '$colors$neutral900',
    },
  },

  variants: {
    hasHover: {
      true: {
        '&:hover': {
          color: '$colors$secondary550',
          [`.${darkTheme} &`]: {
            color: '$colors$secondary500',
          },
          '& svg': {
            color: '$colors$secondary550',
            [`.${darkTheme} &`]: {
              color: '$colors$secondary500',
            },
          },
        },
      },
      false: {},
    },
  },
});

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  '& ._blockchain-name, & ._coin-source': {
    color: '$colors$neutral600',
    [`.${darkTheme} &`]: {
      color: '$colors$neutral800',
    },
  },
  '& ._coin-source-name, & ._custom-token-description': {
    color: '$colors$neutral700',
    [`.${darkTheme} &`]: {
      color: '$colors$neutral900',
    },
  },
});

export const StyledButton = styled(Button, {
  minHeight: '$40',
});

export const TokenSymbolText = styled(Typography, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '96px',
});

export const FlexCenteredContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
