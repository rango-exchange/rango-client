import type { StepSkeletonPropsTypes } from './LoadingSwapDetails.types';

import { ChainToken, Divider, NextIcon, Skeleton } from '@rango-dev/ui';
import React from 'react';

import {
  extraInfoStyles,
  StepContainer,
  stepIconStyles,
  stepInfoStyles,
  stepTitleStyles,
  stepTokensStyles,
} from './LoadingSwapDetails.styles';

export function LoadingSwapDetailStep(props: StepSkeletonPropsTypes) {
  const { extraInfo } = props;
  return (
    <StepContainer>
      <div className={stepTitleStyles()}>
        <Skeleton height={28} width={28} variant="circular" />
        <Divider direction="horizontal" size={8} />
        <Skeleton height={15} width={148} variant="rounded" />
      </div>
      <div className={stepTokensStyles()}>
        <Divider direction="horizontal" size={20} />
        <div className={stepInfoStyles()}>
          <ChainToken size="small" loading chainImage="" tokenImage="" />
          <Divider direction="horizontal" size={8} />
          <Skeleton height={12} width={76} variant="rounded" />
        </div>
        <div className={stepIconStyles()}>
          <NextIcon color="gray" size={16} />
        </div>
        <div className={stepInfoStyles()}>
          <ChainToken size="small" loading chainImage="" tokenImage="" />
          <Divider direction="horizontal" size={8} />
          <Skeleton height={12} width={76} variant="rounded" />
        </div>
      </div>
      {extraInfo && (
        <div className={extraInfoStyles()}>
          <Divider direction="horizontal" size={20} />
          <Skeleton height={22} width={297} variant="rectangular" />
        </div>
      )}
    </StepContainer>
  );
}
