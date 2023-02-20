import React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';

import { styled } from '../../theme';

const StyledSwitchRoot = styled(RadixSwitch.Root, {
  boxSizing: 'border-box',
  boxShadow: 'none',
  borderStyle: 'solid',
  width: '42px',
  height: '22px',
  backgroundColor: '$neutrals300',
  borderColor: '$neutrals400',
  borderRadius: '99999px',
  position: 'relative',
  cursor: 'pointer',
  '&[data-state="checked"]': {
    backgroundColor: '$primary100',
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
  backgroundColor: '$neutrals500',
  transition: ' transform 100ms',
  borderRadius: '999999px',
  willChange: 'transform',
  '&[data-state="checked"]': {
    transform: 'translateX(20px)',
    backgroundColor: '$primary500',
  },
});

export interface PropTypes {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch(props: PropTypes) {
  const { checked, onChange } = props;
  return (
    <StyledSwitchRoot checked={checked} onCheckedChange={onChange}>
      <StyledSwitchThumb />
    </StyledSwitchRoot>
  );
}
