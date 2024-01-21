import { globalCss } from '@stitches/react';

import { darkTheme, styled } from '../../theme';

import { HEADER_CORNDER_RADIUS } from './Header.constants';

export const globalHeaderStyles = globalCss({
  '.rng-scrolled': {
    '.rng-curve-left::before, rng-curve-right::before': {
      borderRadius: '0 !important',
    },
  },
});

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$15 $20',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  position: 'relative',

  '.rng-curve-left,.rng-curve-right': {
    width: HEADER_CORNDER_RADIUS * 2,
    height: HEADER_CORNDER_RADIUS * 2,
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
    transform: 'translateY(100%)',

    '&:before': {
      width: HEADER_CORNDER_RADIUS * 2,
      height: HEADER_CORNDER_RADIUS * 2,
      display: 'block',
      content: '',
      position: 'absolute',
      bottom: 0,
      borderRadius: '50%',
      transition: 'border-radius 0.5s',
    },
  },
  '.rng-curve-left': {
    left: 0,
    '&:before': {
      left: 0,
      boxShadow: `-${HEADER_CORNDER_RADIUS}px -${HEADER_CORNDER_RADIUS}px 0 0 $$color`,
    },
  },
  '.rng-curve-right': {
    right: 0,
    '&:before': {
      right: 0,
      boxShadow: `${HEADER_CORNDER_RADIUS}px -${HEADER_CORNDER_RADIUS}px 0 0 $$color`,
    },
  },
});

export const Suffix = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$5',
});
