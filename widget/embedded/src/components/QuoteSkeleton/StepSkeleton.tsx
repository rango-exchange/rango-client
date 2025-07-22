import type { PropTypes } from './StepSkeleton.types';

import { ChainToken, Divider, NextIcon, Skeleton } from '@arlert-dev/ui';
import React from 'react';

import { StepSeparator } from './QuoteSkeleton.styles';
import {
  StepContent,
  StepIconContainer,
  StepTitle,
  StepTokenInfo,
  StepTokens,
} from './StepSkeleton.styles';

export function StepSkeleton(props: PropTypes) {
  const { separator = true } = props;
  return (
    <>
      <StepTitle>
        <Skeleton height={22} width={22} variant="circular" />
        <Divider direction="horizontal" size={8} />
        <Skeleton height={15} width={148} variant="rounded" />
      </StepTitle>
      <StepContent>
        <StepSeparator hideSeparator={!separator} />
        <StepTokens extraSpace={separator}>
          <StepTokenInfo>
            <ChainToken size="small" loading />
            <Divider direction="horizontal" size={8} />
            <Skeleton height={12} variant="rounded" />
          </StepTokenInfo>
          <StepIconContainer>
            <NextIcon color="gray" size={16} />
          </StepIconContainer>
          <StepTokenInfo>
            <ChainToken size="small" loading />
            <Divider direction="horizontal" size={8} />
            <Skeleton height={12} variant="rounded" />
          </StepTokenInfo>
        </StepTokens>
      </StepContent>
    </>
  );
}
