import { i18n } from '@lingui/core';
import React from 'react';

import { ChangeSlippageButton, Divider, Typography } from '../../components';
import { styled } from '../../theme';

interface PropTypes {
  minRequiredSlippage: string | null;
  changeSlippage: () => void;
}

const StyledMessage = styled(Typography, {
  color: '$error500 !important',
});

export function MinRequiredSlippage({
  minRequiredSlippage,
  changeSlippage,
}: PropTypes) {
  return (
    <StyledMessage variant="body" size="small">
      {i18n.t({
        id: 'We recommend you to increase slippage to at least {minRequiredSlippage} for this route.',
        values: { minRequiredSlippage },
      })}
      <Divider size={8} />
      <ChangeSlippageButton onClick={changeSlippage} />
    </StyledMessage>
  );
}
