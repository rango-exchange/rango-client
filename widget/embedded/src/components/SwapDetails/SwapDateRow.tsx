import type { SwapDateRowProps } from './SwapDetails.types';

import { i18n } from '@lingui/core';
import { Typography } from '@rango-dev/ui';
import React from 'react';

import { rowStyles } from './SwapDetails.styles';

export function SwapDateRow(props: SwapDateRowProps) {
  const { date, isFinished } = props;
  return (
    <div className={rowStyles()}>
      <Typography variant="label" size="large" color="neutral700">
        {isFinished ? i18n.t('Finished at') : i18n.t('Created at')}
      </Typography>
      <Typography variant="label" size="small" color="neutral700">
        {date}
      </Typography>
    </div>
  );
}
