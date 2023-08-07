import React from 'react';
import { StyledSwitchRoot, StyledSwitchThumb } from './Switch.styles';
import { PropTypes } from './Switch.types';

export function Switch(props: PropTypes) {
  const { checked, onChange } = props;
  return (
    <StyledSwitchRoot checked={checked} onCheckedChange={onChange}>
      <StyledSwitchThumb />
    </StyledSwitchRoot>
  );
}
