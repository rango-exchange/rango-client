import type { SwitchPropTypes } from './Switch.types';

import React from 'react';

import { StyledSwitchRoot, StyledSwitchThumb } from './Switch.styles';

export function Switch(props: SwitchPropTypes) {
  const { checked, onChange } = props;
  return (
    <StyledSwitchRoot checked={checked} onCheckedChange={onChange}>
      <StyledSwitchThumb />
    </StyledSwitchRoot>
  );
}
