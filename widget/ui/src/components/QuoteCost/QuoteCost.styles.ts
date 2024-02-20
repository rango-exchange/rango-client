import { css, keyframes, styled } from '../../theme';

export const Container = styled('div', {
  borderRadius: '$xs',
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
});

export const Separator = styled('div', {
  height: '$12',
  marginLeft: '$10',
  marginRight: '$10',
  borderLeft: '1px solid $foreground',
});

export const iconStyles = css({
  width: '$16',
  height: '$16',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const blinker = keyframes({
  '50%': {
    opacity: 0.2,
  },
});

export const itemStyles = css({
  display: 'flex',
  alignItems: 'center',
  '&.feeSection': {
    cursor: 'pointer',
    '&:hover': {
      svg: {
        color: '$secondary',
      },
      '._typography': {
        color: '$secondary',
      },
    },
  },
  '&.warning': {
    animation: `${blinker} 2s linear infinite`,

    svg: {
      color: '$warning500',
    },
    '._typography': {
      color: '$warning500',
    },
  },
});
