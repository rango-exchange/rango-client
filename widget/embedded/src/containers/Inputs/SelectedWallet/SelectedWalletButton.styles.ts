import { Button, darkTheme, styled } from '@rango-dev/ui';

export const WalletButton = styled(Button, {
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral',
    '&:hover': {
      backgroundColor: '$neutral',
    },
  },

  height: '$24',
  variants: {
    variant: {
      contained: {
        padding: '$4 $10',
        borderRadius: '$sm',
        backgroundColor: '$secondary100',
        '&:hover': {
          backgroundColor: '$secondary100',
        },
      },
    },
  },
});
