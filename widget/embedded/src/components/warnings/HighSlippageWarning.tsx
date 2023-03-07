import { Alert, Typography } from '@rangodev/ui';
import React from 'react';
import { ChangeSlippageButton } from '../ChangeSlippageButton';

interface PropTypes {
  selectedSlippage: number;
}

export function HighSlippageWarning(props: PropTypes) {
  const { selectedSlippage } = props;

  return (
    <Alert type="warning">
      <Typography variant="body2">
        Your slippage is high <b>({selectedSlippage})</b>. You could update it in the swap settings
        if you want.
        <ChangeSlippageButton />
      </Typography>
    </Alert>
  );
}
