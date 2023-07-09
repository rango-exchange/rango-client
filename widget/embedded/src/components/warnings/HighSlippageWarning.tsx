import { Alert } from '@rango-dev/ui';
import React from 'react';
import { ChangeSlippageButton } from '../ChangeSlippageButton';
import { i18n } from '@lingui/core';

interface PropTypes {
  selectedSlippage: number;
}

export function HighSlippageWarning(props: PropTypes) {
  const { selectedSlippage } = props;

  return (
    <Alert type="warning" footer={<ChangeSlippageButton />}>
      {i18n.t(
        'highSlippage',
        { selectedSlippage },
        {
          message:
            ' Caution, your slippage is high (={selectedSlippage}). Your trade may be front run.',
        }
      )}
    </Alert>
  );
}
