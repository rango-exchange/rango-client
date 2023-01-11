import React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';

import { styled } from '../../theme';

const StyledSwitchRoot = styled(RadixSwitch.Root, {
  boxSizing: 'border-box',
  boxShadow: 'none',
  borderStyle: 'solid',
  width: '42px',
  height: '22px',
  backgroundColor: '$backgroundColor2',
  borderColor: '$borderColor',
  borderRadius: '99999px',
  position: 'relative',
  '&[data-state="checked"]': {
    // borderColor: '$primary-500',
  },
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
});

const StyledSwitchThumb = styled(RadixSwitch.Thumb, {
  position: 'absolute',
  top: '0',
  boxSizing: 'border-box',
  display: 'block',
  width: '18px',
  height: '18px',
  backgroundColor: 'Gray',
  borderRadius: '999999px',
  transition: 'transform 100ms',
  willChange: 'transform',
  '&[data-state="checked"]': {
    transform: 'translateX(20px)',
    backgroundColor: '$primary-500',
  },
});

export interface PropTypes {}

function Switch(props: PropTypes) {
  return (
    <StyledSwitchRoot>
      <StyledSwitchThumb />
    </StyledSwitchRoot>
  );
}

export default Switch;
