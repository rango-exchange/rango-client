import * as RadixSwitch from '@radix-ui/react-switch';

import { darkTheme, styled } from '../../theme';

export const StyledSwitchRoot = styled(RadixSwitch.Root, {
  boxSizing: 'border-box',
  boxShadow: 'none',
  width: '24px',
  height: '16px',
  $$color: '$colors$neutral600',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral700',
  },
  backgroundColor: '$$color',
  border: 'none',
  borderRadius: '99999px',
  padding: '0',
  cursor: 'pointer',
  transition: 'all 0.35s',
  overflow: 'hidden',

  '&[data-state="checked"]': {
    $$color: '$colors$secondary500',
    [`.${darkTheme} &`]: {
      $$color: '$colors$secondary400',
    },
    backgroundColor: '$$color',
    borderColor: '$$color',
  },
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
});

export const StyledSwitchThumb = styled(RadixSwitch.Thumb, {
  boxSizing: 'border-box',
  position: 'relative',
  left: '$2',
  display: 'block',
  width: '12px',
  height: '12px',
  backgroundColor: '$background',
  borderColor: '$secondary100',
  transition: ' transform 300ms',
  borderRadius: '999999px',
  willChange: 'transform',
  '&:hover': {
    boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 8px',
    '-moz-box-shadow': 'rgba(0, 0, 0, 0.6) 0px 3px 8px',
    '-webkit-box-shadow': 'rgba(0, 0, 0, 0.6) 0px 3px 8px',
    '-o-box-shadow': 'rgba(0, 0, 0, 0.6) 0px 3px 8px',
  },

  '&[data-state="checked"]': {
    transform: 'translateX(8px)',
  },
});
