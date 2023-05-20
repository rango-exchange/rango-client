import { Divider, Typography, styled } from '@rango-dev/ui';
import React from 'react';
import { ChangeSlippageButton } from '../ChangeSlippageButton';

interface PropTypes {
  minRequiredSlippage: string | null;
}

const StyledMessage = styled(Typography, {
  color: '$error500 !important',
});

export function MinRequiredSlippage({ minRequiredSlippage }: PropTypes) {
  return (
    <StyledMessage variant="body2">
      We recommend you to increase slippage to at least &nbsp;
      {minRequiredSlippage}
      &nbsp; for this route.
      <Divider size={8}/>
      <ChangeSlippageButton />
    </StyledMessage>
  );
}
