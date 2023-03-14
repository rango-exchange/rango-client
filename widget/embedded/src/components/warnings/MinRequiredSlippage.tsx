import { Typography } from '@rango-dev/ui';
import React from 'react';
import { ChangeSlippageButton } from '../ChangeSlippageButton';

interface PropTypes {
  minRequiredSlippage: number | null;
}

export function MinRequiredSlippage({ minRequiredSlippage }: PropTypes) {
  return (
    <Typography variant="body2">
      slippage is low =&gt; We recommend you to increase slippage to at least
      {minRequiredSlippage}
      for this route.
      <ChangeSlippageButton />
    </Typography>
  );
}
