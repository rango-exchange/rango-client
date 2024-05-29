import { darkTheme, styled } from '../../theme';
import { Image } from '../common';

export const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  [`& ${Image}`]: { borderRadius: '100%' },
});

export const ChainImageContainer = styled('div', {
  position: 'absolute',
  borderRadius: '100%',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  variants: {
    size: {
      small: {
        right: '-3px',
        bottom: '-3px',
      },
      xmedium: {
        right: '-3px',
        bottom: '-3px',
      },
      medium: {
        right: '0',
        bottom: '0',
      },
      large: {
        right: '-5px',
        bottom: '-5px',
      },
    },
    hasBorder: {
      true: {
        $$borderColor: '$colors$secondary250',
        [`.${darkTheme} &`]: {
          $$borderColor: '$colors$secondary550',
        },
        border: '1px solid $$borderColor',
      },
      false: {},
    },
  },
});
export const TokenImageContainer = styled('div', {
  borderRadius: '100%',
  width: '$30',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  variants: {
    hasBorder: {
      true: {
        $$borderColor: '$colors$secondary550',
        [`.${darkTheme} &`]: {
          $$borderColor: '$colors$secondary500',
        },
        border: '1px solid $$borderColor',
      },
      false: {},
    },
  },
});
