import { i18n } from '@lingui/core';
import React from 'react';

import { Alert } from '../../components/Alert';
import { ChangeSlippageButton } from '../../components/ChangeSlippageButton';

interface PropTypes {
  selectedSlippage: number;
  highSlippage: boolean;
  changeSlippage: () => void;
}

export function HighSlippageWarning(props: PropTypes) {
  const { highSlippage, selectedSlippage, changeSlippage } = props;

  return (
    <>
      {highSlippage && (
        <Alert
          type="warning"
          footer={<ChangeSlippageButton onClick={changeSlippage} />}>
          {i18n.t({
            id: ' Caution, your slippage is high (={selectedSlippage}). Your trade may be front run.',
            values: { selectedSlippage },
          })}
        </Alert>
      )}
    </>
  );
}
