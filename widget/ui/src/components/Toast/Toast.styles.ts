import { css, darkTheme, lightTheme, styled } from '../../theme';
import { Typography } from '../Typography';

import {
  HOVER_TRANSITION_DURATION,
  TOAST_TRANSITION_DURATION,
} from './Toast.helpers';

export const toastContentStyles = css({
  transition: `transform ${HOVER_TRANSITION_DURATION}ms ease-in-out`,
  '&:hover': {
    transform: 'scale(0.99)',
  },
});

export const ToastContentContainer = styled('div', {
  transition: `transform ${TOAST_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.75, 1.25)`,
  cursor: 'pointer',
  variants: {
    isActive: {
      true: {},
    },
    isVisible: {
      true: {},
    },
    position: {
      'right-top': {},
      'right-bottom': {},
      'left-top': {},
      'left-bottom': {},
      'center-top': {},
      'center-bottom': {},
    },
  },
  compoundVariants: [
    {
      position: 'right-top',
      isActive: true,
      isVisible: true,
      css: {
        transform: 'translateX(0)',
        maxHeight: '200px',
      },
    },
    {
      position: 'right-top',
      isActive: false,
      isVisible: true,
      css: {
        maxHeight: '200px',
        transform: 'translateX(100%)',
      },
    },
    {
      position: 'right-top',
      isActive: false,
      isVisible: false,
      css: {
        maxHeight: '0px',
        transform: 'translateX(100%)',
        transition: `max-height ${TOAST_TRANSITION_DURATION}ms ease-in-out`,
      },
    },
    {
      position: 'right-bottom',
      isActive: true,
      isVisible: true,
      css: {
        transform: 'translateX(0)',
        maxHeight: '200px',
      },
    },
    {
      position: 'right-bottom',
      isActive: false,
      isVisible: true,
      css: {
        transform: 'translateX(100%)',
        maxHeight: '200px',
      },
    },
    {
      position: 'right-bottom',
      isActive: false,
      isVisible: false,
      css: {
        transform: 'translateX(100%)',
        maxHeight: '0px',
        transition: `max-height ${TOAST_TRANSITION_DURATION}ms ease-in-out`,
      },
    },
    {
      position: 'left-top',
      isActive: true,
      isVisible: true,
      css: {
        transform: 'translateX(0)',
        maxHeight: '200px',
      },
    },
    {
      position: 'left-top',
      isActive: false,
      isVisible: true,
      css: {
        transform: 'translateX(-100%)',
        maxHeight: '200px',
      },
    },
    {
      position: 'left-top',
      isActive: false,
      isVisible: false,
      css: {
        transform: 'translateX(-100%)',
        maxHeight: '0px',
        transition: `max-height ${TOAST_TRANSITION_DURATION}ms ease-in-out`,
      },
    },
    {
      position: 'left-bottom',
      isActive: true,
      isVisible: true,
      css: {
        transform: 'translateX(0)',
        maxHeight: '200px',
      },
    },
    {
      position: 'left-bottom',
      isActive: false,
      isVisible: true,
      css: {
        transform: 'translateX(-100%)',
        maxHeight: '200px',
      },
    },
    {
      position: 'left-bottom',
      isActive: false,
      isVisible: false,
      css: {
        transform: 'translateX(-100%)',
        maxHeight: '0px',
        transition: `max-height ${TOAST_TRANSITION_DURATION}ms ease-in-out`,
      },
    },
    {
      position: 'center-top',
      isActive: true,
      isVisible: true,
      css: {
        maxHeight: '200px',
        transform: 'translateY(0)',
        opacity: 1,
      },
    },
    {
      position: 'center-top',
      isActive: false,
      isVisible: true,
      css: {
        maxHeight: '200px',
        transform: 'translateY(-1000%)',
        opacity: 0,
      },
    },
    {
      position: 'center-top',
      isActive: false,
      isVisible: false,
      css: {
        maxHeight: '0px',
        opacity: 0,
        transform: 'translateY(-1000%)',
        transition: `max-height ${TOAST_TRANSITION_DURATION}ms ease-in-out`,
      },
    },
    {
      position: 'center-bottom',
      isActive: true,
      isVisible: true,
      css: {
        transform: 'translateY(0)',
        maxHeight: '200px',
        opacity: 1,
      },
    },
    {
      position: 'center-bottom',
      isActive: false,
      isVisible: true,
      css: {
        transform: 'translateY(1000%)',
        maxHeight: '200px',
        opacity: 0,
      },
    },
    {
      position: 'center-bottom',
      isActive: false,
      isVisible: false,
      css: {
        transform: 'translateY(1000%)',
        maxHeight: '0px',
        opacity: 0,
        transition: `max-height ${TOAST_TRANSITION_DURATION}ms ease-in-out`,
      },
    },
  ],
});

export const ToastContainer = styled('div', {
  overflow: 'hidden',
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
        flexDirection: 'column-reverse',
      },
      'left-top': {
        left: 12,
        top: 2,
      },
      'left-bottom': {
        left: 12,
        bottom: 2,
        flexDirection: 'column-reverse',
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
        flexDirection: 'column-reverse',
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
