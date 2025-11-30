import type { PropTypes } from './InsufficientBalanceWarning.types';

import { i18n } from '@lingui/core';
import { Divider, Typography } from '@rango-dev/ui';
import React from 'react';

import { WarningItem } from './InsufficientBalanceWarning.styles';

export function InsufficientBalanceWarning(props: PropTypes) {
  const { warning } = props;

  return (
    <WarningItem>
      <Typography variant="label" size="medium" color="$warning500">
        {warning.title}
        <Divider size="4" />
      </Typography>
      <div className="row">
        <Typography variant="body" size="medium">
          {i18n.t('Required Balance:')}
        </Typography>
        <Typography variant="body" size="medium">
          {`${warning.requiredBalance} ${warning.assetSymbol}`}
        </Typography>
      </div>
      <Divider size="4" />
      <div className="row">
        <Typography variant="body" size="medium">
          {i18n.t('Your Balance:')}
        </Typography>
        <Typography variant="title" size="small" color="$warning500">
          {`${warning.userBalance} ${warning.assetSymbol}`}
        </Typography>
      </div>
    </WarningItem>
  );
}
