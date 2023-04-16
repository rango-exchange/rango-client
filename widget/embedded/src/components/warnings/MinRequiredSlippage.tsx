import { Typography } from '@rango-dev/ui';
import React from 'react';
import { ChangeSlippageButton } from '../ChangeSlippageButton';

interface PropTypes {
  minRequiredSlippage: string | null;
}

export function MinRequiredSlippage({ minRequiredSlippage }: PropTypes) {
  return (
    <Typography variant="body2">
      We recommend you to increase slippage to at least &nbsp;
      {minRequiredSlippage}
      &nbsp; for this route.
      <ChangeSlippageButton />
    </Typography>
  );
}
