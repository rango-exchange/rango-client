import { darkTheme, keyframes, lightTheme, styled } from '../../theme';
import { Typography } from '../Typography';

const toastOpacity = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const ToastContentContainer = styled('div', {
  variants: {
    horizontal: {
      right: {
        right: 12,
        animation: `${toastOpacity} .7s`,
      },
      left: {
        left: 12,
        animation: `${toastOpacity} .7s`,
      },
    },
  },
});

export const ToastContainer = styled('div', {
  position: 'absolute',
  zIndex: 9999,
  display: 'flex',
  gap: '$4',
  flexDirection: 'column',
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
        top: 2,
      },
      bottom: {
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
  backgroundColor: '$background',
  borderRight: '1px solid',
  [`.${darkTheme} &`]: {
    backgroundColor: '#070917',
  },
  '&:hover': {
    backgroundColor: '$info100',
    [`.${darkTheme} &`]: {
      backgroundColor: '#111733',
    },
  },
  variants: {
    type: {
      error: {
        borderRightColor: '$error500',
      },
      success: {
        borderRightColor: '$success500',
      },
      warning: {
        borderRightColor: '$warning500',
      },
      info: {
        borderRightColor: '$info500',
      },
      loading: {
        borderRightColor: '$info500',
      },
    },
  },
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
  justifyContent: 'center',
  alignItems: 'center',
});
