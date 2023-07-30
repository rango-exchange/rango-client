import React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';

import { styled } from '../../theme';

const StyledSwitchRoot = styled(RadixSwitch.Root, {
  boxSizing: 'border-box',
  boxShadow: 'none',
  borderStyle: 'solid',
  width: '24px',
  height: '16px',
  backgroundColor: '$surface500',
  borderColor: '$surface500',
  borderRadius: '99999px',
  position: 'relative',
  padding: '0',
  cursor: 'pointer',

  '&[data-state="checked"]': {
    backgroundColor: '$primary',
    borderColor: '$primary',
  },
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
});

const StyledSwitchThumb = styled(RadixSwitch.Thumb, {
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
