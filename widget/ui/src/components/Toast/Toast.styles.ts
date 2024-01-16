import { darkTheme, keyframes, styled } from '../../theme';

const toast_opacity = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const Container = styled('div', {
  padding: '$4',
  variants: {
    horizontal: {
      right: {
        right: 12,
        animation: `${toast_opacity} .7s`,
      },
      left: {
        left: 12,
        animation: `${toast_opacity} .7s`,
      },
    },
  },
});

export const Wrapper = styled('div', {
  position: 'absolute',
  zIndex: 9999,
  variants: {
    horizontal: {
      right: {
        right: 12,
      },
      left: {
        left: 12,
      },
    },

    vertical: {
      top: {
        top: 0,
      },
      bottom: {
        bottom: 0,
      },
    },
  },
});

export const AlertContainer = styled('div', {
  '._alert': {
    background: '$background',
    padding: '$10',
    borderRadius: '$sm',
    width: 292,
    '&:hover': {
      $$color: '$colors$info100',
      [`.${darkTheme} &`]: {
        $$color: '$colors$info600',
      },
      background: '$$color',
    },
  },
  variants: {
    type: {
      error: {
        '._alert': {
          borderRight: '1px solid $error500',
        },
      },
      success: {
        '._alert': {
          borderRight: '1px solid $success500',
        },
      },
      warning: {},
      info: {},
      loading: {},
    },
  },
});
