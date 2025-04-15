import { darkTheme, keyframes, styled } from '@rango-dev/ui';

export const ROTATE_ANIMATION_DURATION = 180;

const rotateAnimation = keyframes({
  '0%': {
    transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
  },
  '33%': {
    transform: 'rotateX(0deg) rotateZ(78deg) rotateY(66deg)',
  },
  '66%': {
    transform: 'rotateX(0deg) rotateZ(163deg) rotateY(66deg)',
  },
  '100%': {
    transform: 'rotateX(0deg) rotateZ(180deg) rotateY(0deg)',
  },
});
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
    '&.rotate': {
      '& svg': {
        animation: `${rotateAnimation} ${ROTATE_ANIMATION_DURATION}ms ease-in-out forwards`,
      },
    },
  },
});
