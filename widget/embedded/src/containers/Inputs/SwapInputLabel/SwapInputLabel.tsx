import type { PropTypes } from './SwapInputLabel.types';

import { Typography } from '@rango-dev/ui';
import React from 'react';

import { Container } from './SwapInputLabel.styles';

export function SwapInputLabel(props: PropTypes) {
  const { label, suffix } = props;

  return (
    <Container>
      <Typography variant="body" size="small" color="neutral700">
        {label}
      </Typography>
      {suffix}
    </Container>
  );
}
