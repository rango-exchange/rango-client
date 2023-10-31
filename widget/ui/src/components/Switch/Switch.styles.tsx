import * as RadixSwitch from '@radix-ui/react-switch';

import { darkTheme, styled } from '../../theme';

export const StyledSwitchRoot = styled(RadixSwitch.Root, {
  boxSizing: 'border-box',
  boxShadow: 'none',
  borderStyle: 'solid',
  width: '24px',
  height: '16px',
  backgroundColor: '$neutral600',
  borderColor: '$neutral600',
  borderRadius: '99999px',
  position: 'relative',
  padding: '0',
  cursor: 'pointer',
  transition: 'all 0.35s',

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
  position: 'absolute',
  top: '0',
  boxSizing: 'border-box',
  display: 'block',
  width: '12px',
  height: '12px',
  backgroundColor: '$background',
  borderColor: '$secondary100',
  transition: ' transform 300ms',
  borderRadius: '999999px',
  willChange: 'transform',

  '&[data-state="checked"]': {
    transform: 'translateX(8px)',
  },
});
