import { i18n } from '@lingui/core';
import { ChainToken, Divider, Skeleton, Typography } from '@rango-dev/ui';
import React from 'react';

import { Container, StepSeparator } from './LoadingSwapDetails.styles';
import { LoadingSwapDetailStep } from './LoadingSwapDetailStep';

export function LoadingSwapDetails() {
  const routeSummary = (
    <div className="route-summary-item">
      <div className="token-amount">
        <ChainToken loading size="medium" chainImage="" tokenImage="" />
        <Divider size={8} direction="horizontal" />
        <Skeleton height={15} width={148} variant="rounded" />
      </div>
      <Skeleton height={12} width={64} variant="rounded" />
    </div>
  );

  return (
    <Container>
      <div className="cost">
        <Skeleton width={60} height={10} variant="rounded" />
        <Divider size={4} direction="horizontal" />
        <Skeleton width={60} height={10} variant="rounded" />
        <Divider size={4} direction="horizontal" />
        <Skeleton width={60} height={10} variant="rounded" />
      </div>

      <div className="route-summary">
        {routeSummary}
        <div className="route-summary-separator"></div>
        {routeSummary}
      </div>

      <div className="swaps-steps">
        <Typography variant="title" size="small">
          {i18n.t('Swaps steps')}
        </Typography>
      </div>

      <div className="step-container">
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
