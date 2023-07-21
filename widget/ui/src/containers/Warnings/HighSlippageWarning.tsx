import { Alert } from '../../components/Alert';
import React from 'react';
import { ChangeSlippageButton } from '../../components/ChangeSlippageButton';
import { i18n } from '@lingui/core';

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
          {i18n.t(
            'highSlippage',
            { selectedSlippage },
            {
              message:
                ' Caution, your slippage is high (={selectedSlippage}). Your trade may be front run.',
            }
          )}
        </Alert>
      )}
    </>
  );
}
