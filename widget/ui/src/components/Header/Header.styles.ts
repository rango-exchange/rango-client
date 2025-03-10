import { globalCss } from '@stitches/react';

import { darkTheme, styled } from '../../theme.js';

import { HEADER_CORNDER_RADIUS } from './Header.constants.js';

export const globalHeaderStyles = globalCss({
  '.rng-scrolled': {
    '.rng-curve-left::before, rng-curve-right::before': {
      borderRadius: '0 !important',
    },
  },
});

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  padding: '$20 $20 $15 $20',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  position: 'relative',
  borderTopRightRadius: '$primary',
  borderTopLeftRadius: '$primary',

  variants: {
    titlePosition: {
      left: {
        justifyContent: 'start',
      },
      center: {
        justifyContent: 'center',
      },
      right: {
        justifyContent: 'end',
      },
    },
  },

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

export const Prefix = styled('div', {
  position: 'absolute',
  left: '$20',
  display: 'flex',
  alignItems: 'center',
  gap: '$5',
});

export const Suffix = styled('div', {
  position: 'absolute',
  right: '$20',
  display: 'flex',
  alignItems: 'center',
  gap: '$5',
});
