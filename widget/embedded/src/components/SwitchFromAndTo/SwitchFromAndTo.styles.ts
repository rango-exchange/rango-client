import { keyframes, styled } from '@arlert-dev/ui';

export const ROTATE_ANIMATION_DURATION = 450;

const rotateAnimation = keyframes({
  '0%': {
    transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
  },
  '33%': {
    transform: 'rotateX(0deg) rotateZ(78deg) rotateY(66deg)',
  },
  '66%': {
    transform: 'rotateX(0deg) rotateZ(163deg) rotateY(66deg)',
  },
  '100%': {
    transform: 'rotateX(0deg) rotateZ(180deg) rotateY(0deg)',
  },
});

export const SwitchButtonContainer = styled('div', {
  position: 'absolute',
  bottom: '-12px',
  left: '50%',
  transform: 'translate(-50%, 10%)',
  cursor: 'pointer',
});

export const StyledButton = styled('div', {
  borderRadius: '$md',
  border: '3px solid $background',
  background: '$neutral100',
  width: '$24',
  height: '$24',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '$foreground',
  '&.rotate': {
    '& svg': {
      animation: `${rotateAnimation} ${ROTATE_ANIMATION_DURATION}ms ease-in-out forwards`,
    },
  },
  '&:hover': {
    color: '$secondary500',
    transform: 'translateY(1px) scale(1.04)',
    boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.05)',
  },
});
