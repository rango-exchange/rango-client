import * as RadixSwitch from '@radix-ui/react-switch';
import { styled } from '../../theme';

export const StyledSwitchRoot = styled(RadixSwitch.Root, {
  boxSizing: 'border-box',
  boxShadow: 'none',
  borderStyle: 'solid',
  width: '24px',
  height: '16px',
  backgroundColor: '$surface400',
  borderColor: '$surface400',
  borderRadius: '99999px',
  position: 'relative',
  padding: '0',
  cursor: 'pointer',
  transition: 'all 0.35s',

  '&:hover': {
    backgroundColor: '$secondary100',
    borderColor: '$secondary100',
  },
  '&[data-state="checked"]': {
    backgroundColor: '$primary',
    borderColor: '$primary',
  },
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
});

export const StyledSwitchThumb = styled(RadixSwitch.Thumb, {
  position: 'absolute',
  top: '0',
  boxSizing: 'border-box',
  display: 'block',
  width: '12px',
  height: '12px',
  backgroundColor: '$neutral100',
  borderColor: '$secondary100',
  transition: ' transform 300ms',
  borderRadius: '999999px',
  willChange: 'transform',

  '&[data-state="checked"]': {
    transform: 'translateX(8px)',
  },
});
