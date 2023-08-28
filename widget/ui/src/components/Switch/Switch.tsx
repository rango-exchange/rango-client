import type { PropTypes } from './Switch.types';

import React from 'react';

import { StyledSwitchRoot, StyledSwitchThumb } from './Switch.styles';

export function Switch(props: PropTypes) {
  const { checked, onChange } = props;
  return (
    <StyledSwitchRoot checked={checked} onCheckedChange={onChange}>
      <StyledSwitchThumb />
    </StyledSwitchRoot>
  );
}
