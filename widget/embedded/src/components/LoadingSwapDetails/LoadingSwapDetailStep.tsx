import type { StepSkeletonPropsTypes } from './LoadingSwapDetails.types';

import { ChainToken, Divider, NextIcon, Skeleton } from '@rango-dev/ui';
import React from 'react';

import { StepContainer } from './LoadingSwapDetails.styles';

export function LoadingSwapDetailStep(props: StepSkeletonPropsTypes) {
  const { extraInfo } = props;
  return (
    <StepContainer>
      <div className="step-title">
        <Skeleton height={28} width={28} variant="circular" />
        <Divider direction="horizontal" size={8} />
        <Skeleton height={15} width={148} variant="rounded" />
      </div>
      <div className="step-tokens">
        <Divider direction="horizontal" size={20} />
        <div className="step-token-info">
          <ChainToken size="small" loading chainImage="" tokenImage="" />
          <Divider direction="horizontal" size={8} />
          <Skeleton height={12} width={76} variant="rounded" />
        </div>
        <div className="step-icon-container">
          <NextIcon color="gray" size={16} />
        </div>
        <div className="step-token-info">
          <ChainToken size="small" loading chainImage="" tokenImage="" />
          <Divider direction="horizontal" size={8} />
          <Skeleton height={12} width={76} variant="rounded" />
        </div>
      </div>
      {extraInfo && (
        <div className="extra-info">
          <Divider direction="horizontal" size={20} />
          <Skeleton height={22} width={297} variant="rectangular" />
        </div>
      )}
    </StepContainer>
  );
}
