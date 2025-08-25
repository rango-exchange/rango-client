import { Button, css, darkTheme, styled } from '@rango-dev/ui';

export const MaxButton = styled(Button, {
  $$color: '$colors$secondary100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$secondary800',
  },
  backgroundColor: '$$color',
  '& ._typography': {
    color: '$colors$secondary500',
    [`.${darkTheme} &`]: {
      color: '$colors$secondary250',
    },
  },
  variants: {
    size: {
      small: {
        padding: '$4 $8',
        height: '$20',
        alignItems: 'center',
        borderRadius: '$xs',
        '& span': {
          display: 'flex',
        },
      },
    },
  },
});

export const balanceStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
