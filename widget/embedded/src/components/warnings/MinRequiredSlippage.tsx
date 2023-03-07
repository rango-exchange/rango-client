import { Typography } from '@rango-dev/ui';
import React from 'react';
import { ChangeSlippageButton } from '../ChangeSlippageButton';

export function MinRequiredSlippage(minRequiredSlippage: number | null) {
  return (
    <Typography variant="body2">
      Your slippage should be {minRequiredSlippage} at least
      <ChangeSlippageButton />
    </Typography>
  );
}
