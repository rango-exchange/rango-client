import { darkTheme, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  padding: '$4',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const Rate = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  '& .rate-text': {
    color: '$neutral700',
    [`.${darkTheme} &`]: {
      color: '$neutral700',
    },
  },
  '& ._icon-button': {
    transform: 'rotate(90deg)',
    width: '$16',
    height: '$16',
  },
});
