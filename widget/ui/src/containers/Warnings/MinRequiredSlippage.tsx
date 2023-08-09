import React from 'react';
import { i18n } from '@lingui/core';
import { Divider, Typography, ChangeSlippageButton } from '../../components';
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
      {i18n.t(
        'increaseSlippage',
        { minRequiredSlippage },
        {
          message:
            'We recommend you to increase slippage to at least {minRequiredSlippage} for this route.',
        }
      )}
      <Divider size={8} />
      <ChangeSlippageButton onClick={changeSlippage} />
    </StyledMessage>
  );
}
