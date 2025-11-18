import type { PropTypes } from './InsufficientFeeWarning.types';

import { i18n } from '@lingui/core';
import { Alert, Image, Typography } from '@rango-dev/ui';
import React from 'react';

import { WarningItem } from './InsufficientFeeWarning.styles';

export function InsufficientFeeWarning(props: PropTypes) {
  const { warning } = props;

  return (
    <WarningItem key={warning.selectedWallet.blockchain}>
      <div>
        <Image src={warning.selectedWallet.image} size={20} />
        <Alert type="warning" variant="alarm" title={i18n.t('Network fee')} />
      </div>
      <div>
        <Typography variant="body" size="medium">
          {i18n.t('Required Balance:')}
        </Typography>
        <Typography variant="title" size="small">
          {warning.requiredBalance}
        </Typography>
      </div>
      <div>
        <Typography variant="body" size="medium">
          {i18n.t('Your Balance:')}
        </Typography>
        <Typography variant="title" size="small">
          {warning.userBalance}
        </Typography>
      </div>
    </WarningItem>
  );
}
