import type { RadioPropTypes } from './Radio.types';

import React from 'react';

import { StyledIndicator, StyledItem } from './Radio.styles';

export function Radio(props: RadioPropTypes) {
  const { value } = props;
  return (
    <StyledItem value={value} id={value}>
      <StyledIndicator />
    </StyledItem>
  );
}
