import { Button, keyframes, styled } from '@rango-dev/ui';

export const CopyCodeBlock = styled('div', {
  position: 'absolute',
  right: '$16',
  bottom: '$12',
});

export const CopyCodeBlockButton = styled(Button, {
  width: '$48',
  height: '$48',
  lineHeight: '$12 !important',
});

export const CodeBlockContainer = styled('div', {
  position: 'relative',
  borderRadius: '$sm',
  height: '507px',
  width: '100%',
});

const copyIconFadeIn = keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

const copyIconFadeOut = keyframes({
  '0%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

export const CopyCodeBlockButtonIcon = styled('span', {
  variants: {
    visible: {
      true: {
        animation: `${copyIconFadeIn} .5s ease-in-out`,
        opacity: 1,
      },
      false: {
        animation: `${copyIconFadeOut} .5s ease-in-out`,
        opacity: 0,
      },
    },
  },
});

const doneIconFadeIn = keyframes({
  '0%': {
    transform: 'translateY(12px)',
    opacity: 0,
  },
  '100%': {
    transform: 'translateY(0)',
    opacity: 1,
  },
});

export const CopyCodeBlockButtonDoneIcon = styled('span', {
  position: 'absolute',
  top: '12px',
  left: '12px',
  transform: 'translateY(0)',
  variants: {
    visible: {
      true: {
        animation: `${doneIconFadeIn} .5s ease-in-out`,
        transform: 'translateY(0)',
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
});

const SuccessfulAlertContainerTransform = keyframes({
  '0%': {
    transform: 'translateY(24px) translateX(-50%)',
    opacity: 0,
  },
  '100%': {
    transform: 'translateY(0) translateX(-50%)',
    opacity: 1,
  },
});

export const SuccessfulAlertContainer = styled('div', {
  display: 'inline',
  position: 'fixed',
  bottom: '$12',
  left: '50%',
  variants: {
    visible: {
      true: {
        animation: `${SuccessfulAlertContainerTransform} .5s ease-in-out`,
        transform: 'translateY(0) translateX(-50%)',
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
});
