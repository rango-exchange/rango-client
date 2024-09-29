import * as Dialog from '@radix-ui/react-dialog';

import { keyframes, styled } from '../../theme.js';
import { IconButton } from '../IconButton/index.js';

const DialogOverlayAnimateIn = keyframes({
  '0%': {
    backgroundColor: 'transparent',
  },
  '100%': {
    backgroundColor: '$overlay',
  },
});

const DialogOverlayAnimateOut = keyframes({
  '0%': {
    backgroundColor: '$overlay',
  },
  '100%': {
    backgroundColor: 'transparent',
  },
});

export const DialogOverlay = styled(Dialog.Overlay, {
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  width: '100%',
  height: '100%',
  zIndex: 10,
  borderRadius: '$primary',
  overflow: 'hidden',
  backgroundColor: 'transparent',

  "&[data-state='open']": {
    backgroundColor: '$overlay',
    animation: `${DialogOverlayAnimateIn} .45s ease-in-out`,
  },
  "&[data-state='closed']": {
    backgroundColor: 'transparent',
    animation: `${DialogOverlayAnimateOut} .45s ease-in-out`,
  },
});

const DialogContentRightAnimateIn = keyframes({
  '0%': {
    transform: 'translateX(100%)',
  },
  '100%': {
    transform: 'translateX(0%)',
  },
});

const DialogContentRightAnimateOut = keyframes({
  '0%': {
    transform: 'translateX(0%)',
  },
  '100%': {
    transform: 'translateX(100%)',
  },
});
const DialogContentCenterAnimateIn = keyframes({
  '0%': {
    top: '100%',
    transform: 'translate(-50%, 100%)',
  },
  '100%': {
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

const DialogContentCenterAnimateOut = keyframes({
  '0%': {
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  '100%': {
    top: '100%',
    transform: 'translate(-50%, 100%)',
  },
});
const DialogContentBottomAnimateIn = keyframes({
  '0%': {
    transform: 'translateY(100%)',
  },
  '100%': {
    transform: 'translateY(0%)',
  },
});

const DialogContentBottomAnimateOut = keyframes({
  '0%': {
    transform: 'translateY(0%)',
  },
  '100%': {
    transform: 'translateY(100%)',
  },
});

export const DialogContent = styled(Dialog.Content, {
  backgroundColor: '$background',
  width: '100%',
  borderRadius: '$primary',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 9999999,
  position: 'absolute',

  variants: {
    anchor: {
      right: {
        right: '0%',
        "&[data-state='open']": {
          animation: `${DialogContentRightAnimateIn} .45s ease-in-out`,
        },
        "&[data-state='closed']": {
          animation: `${DialogContentRightAnimateOut} .45s ease-in-out`,
        },
      },
      center: {
        left: '50%',
        transform: 'translate(-50%, -50%)',
        "&[data-state='open']": {
          top: '50%',
          animation: `${DialogContentCenterAnimateIn} .45s ease-in-out`,
        },
        "&[data-state='closed']": {
          top: '100%',
          animation: `${DialogContentCenterAnimateOut} .45s ease-in-out`,
        },
      },
      bottom: {
        bottom: 0,
        "&[data-state='open']": {
          animation: `${DialogContentBottomAnimateIn} .45s ease-in-out`,
        },
        "&[data-state='closed']": {
          animation: `${DialogContentBottomAnimateOut} .45s ease-in-out`,
        },
      },
    },
  },
});

export const Flex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  [`& ${IconButton}`]: {
    padding: '$5',
  },
});
export const ModalHeader = styled('div', {
  padding: '$20 $20 $0 $20',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  variants: {
    noTitle: {
      true: {
        justifyContent: 'flex-end',
      },
    },
  },
});

export const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '$0 $20 $10 $20',
  backgroundColor: '$background',
  position: 'relative',
  overflowY: 'auto',
  overflowX: 'hidden',
});

export const DialogTitle = styled(Dialog.DialogTitle, {
  margin: 0,
});

export const Footer = styled('div', {
  padding: '0 $20 $10',
  '& .footer__logo': {
    '&.logo__show': {
      opacity: 1,
    },
    '&.logo__hidden': {
      visibility: 'hidden',
    },
  },
});
