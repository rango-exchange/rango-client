import React from 'react';
import { HIGH_SLIPPAGE } from '../../constants/swapSettings';
import { HighSlippageWarning } from './HighSlippageWarning';

interface PropTypes {
  selectedSlippage: number;
}

export function ConfirmSwapExtraMessages(props: PropTypes) {
  const { selectedSlippage } = props;
  const highSlippage = selectedSlippage >= HIGH_SLIPPAGE;

  return (
    <>
      {highSlippage && (
        <HighSlippageWarning selectedSlippage={selectedSlippage} />
      )}
    </>
  );
}
