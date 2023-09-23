import { darkTheme, styled } from '../../theme';

export const BaseListItemButton = styled('div', {
  '& button': {
    '&:focus-visible': {
      borderRadius: '$xs',

      outline: 0,
      $$color: '$colors$info100',
      [`.${darkTheme} &`]: {
        $$color: '$colors$neutral400',
      },
      backgroundColor: '$$color',
    },
    '&:hover': {
      $$color: '$colors$info100',
      borderRadius: '$xs',

      [`.${darkTheme} &`]: {
        $$color: '$colors$neutral400',
      },
      backgroundColor: '$$color',
      cursor: 'pointer',
    },
    '&:active': {
      transform: 'scale(0.99)',
    },
  },
});
