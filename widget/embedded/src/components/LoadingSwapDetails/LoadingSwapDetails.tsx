import { i18n } from '@lingui/core';
import { ChainToken, Divider, Skeleton, Typography } from '@rango-dev/ui';
import React from 'react';

import {
  Container,
  costStyles,
  quoteSummaryItemStyles,
  quoteSummarySeparatorStyles,
  quoteSummaryStyles,
  StepSeparator,
  swapsStepsStyles,
  tokenAmountStyles,
} from './LoadingSwapDetails.styles';
import { LoadingSwapDetailStep } from './LoadingSwapDetailStep';

export function LoadingSwapDetails() {
  const quoteSummary = (
    <div className={quoteSummaryItemStyles()}>
      <div className={tokenAmountStyles()}>
        <ChainToken loading size="medium" chainImage="" tokenImage="" />
        <Divider size={8} direction="horizontal" />
        <Skeleton height={15} width={148} variant="rounded" />
      </div>
      <Skeleton height={12} width={64} variant="rounded" />
    </div>
  );

  return (
    <Container>
      <div className={costStyles()}>
        <Skeleton width={60} height={10} variant="rounded" />
        <Divider size={4} direction="horizontal" />
        <Skeleton width={60} height={10} variant="rounded" />
        <Divider size={4} direction="horizontal" />
        <Skeleton width={60} height={10} variant="rounded" />
      </div>

      <div className={quoteSummaryStyles()}>
        {quoteSummary}
        <div className={quoteSummarySeparatorStyles()}></div>
        {quoteSummary}
      </div>

      <div className={swapsStepsStyles()}>
        <Typography variant="title" size="small">
          {i18n.t('Swaps steps')}
        </Typography>
      </div>

      <div>
        <LoadingSwapDetailStep extraInfo />
        <StepSeparator />
        <LoadingSwapDetailStep />
        <StepSeparator />
        <LoadingSwapDetailStep />
        <StepSeparator />
        <LoadingSwapDetailStep />
      </div>
    </Container>
  );
}
