import { darkTheme, keyframes, lightTheme, styled } from '../../theme';
import { Typography } from '../Typography';

const toastOpacity = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const ToastContentContainer = styled('div', {
  animation: `${toastOpacity} .7s`,
});

export const ToastContainer = styled('div', {
  position: 'absolute',
  zIndex: 9999,
  display: 'flex',
  gap: '$4',
  flexDirection: 'column',
  variants: {
    position: {
      'right-top': {
        right: 12,
        top: 2,
      },
      'right-bottom': {
        right: 12,
        bottom: 2,
      },
      'left-top': {
        left: 12,
        top: 2,
      },
      'left-bottom': {
        left: 12,
        bottom: 2,
      },
      'center-top': {
        left: '50%',
        transform: 'translateX(-50%)',
        top: 2,
      },
      'center-bottom': {
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 2,
      },
    },
  },
});

export const AlertBox = styled('div', {
  display: 'flex',
  borderRadius: '$sm',
  width: '292px',
  minHeight: '52px',
  variants: {
    variant: {
      custom: {
        backgroundColor: '$background',
        borderRight: '1px solid',
        '&:hover': {
          backgroundColor: '$info100',
          [`.${darkTheme} &`]: {
            backgroundColor: '$neutral300',
          },
        },
      },
      standard: {
        '& ._alert': {
          padding: '$10',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
    type: {
      error: {},
      success: {},
      warning: {},
      info: {},
      loading: {},
    },
  },
  compoundVariants: [
    {
      variant: 'custom',
      type: 'error',

      css: {
        borderRightColor: '$error500',
      },
    },
    {
      variant: 'custom',
      type: 'success',
      css: {
        borderRightColor: '$success500',
      },
    },
    {
      variant: 'custom',
      type: 'warning',
      css: {
        borderRightColor: '$warning500',
      },
    },
    {
      variant: 'custom',
      type: 'info',
      css: {
        borderRightColor: '$info500',
      },
    },
    {
      variant: 'custom',
      type: 'loading',
      css: {
        borderRightColor: '$info500',
      },
    },
  ],
});

export const AlertFlexContainer = styled('div', {
  display: 'flex',
  padding: '$10',
  alignItems: 'center',
});

export const StyledTypography = styled(Typography, {
  variants: {
    hasColor: {
      false: {
        [`.${lightTheme} &`]: {
          color: '$neutral700',
        },
        [`.${darkTheme} &`]: {
          color: '$neutral900',
        },
      },
    },
  },
});

export const ToastStoryContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
