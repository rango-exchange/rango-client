import type { SwitchPropTypes } from './Switch.types.js';

import React from 'react';

import { StyledSwitchRoot, StyledSwitchThumb } from './Switch.styles.js';

export function Switch(props: SwitchPropTypes) {
  const { checked, onChange } = props;
  return (
    <StyledSwitchRoot checked={checked} onCheckedChange={onChange}>
      <StyledSwitchThumb />
    </StyledSwitchRoot>
  );
}
