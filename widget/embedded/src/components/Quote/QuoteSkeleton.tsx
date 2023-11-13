import type { PropTypes } from './QuoteSkeleton.types';

import { ChainToken, Divider, NextIcon, Skeleton } from '@rango-dev/ui';
import React from 'react';

import { Container, StepSeparator } from './QuoteSkeleton.styles';

function StepSkeleton(props: { separator?: boolean }) {
  const { separator = true } = props;
  return (
    <>
      <div className="step__title">
        <Skeleton height={22} width={22} variant="circular" />
        <Divider direction="horizontal" size={8} />
        <Skeleton height={15} width={148} variant="rounded" />
      </div>
      <div className="step__content">
        <StepSeparator hideSeparator={!separator} />
        <div className="step__tokens">
          <div className="step__token-info">
            <ChainToken size="small" loading chainImage="" tokenImage="" />
            <Divider direction="horizontal" size={8} />
            <Skeleton height={12} width={76} variant="rounded" />
          </div>
          <div className="step__icon-container">
            <NextIcon color="gray" size={16} />
          </div>
          <div className="step__token-info">
            <ChainToken size="small" loading chainImage="" tokenImage="" />
            <Divider direction="horizontal" size={8} />
            <Skeleton height={12} width={76} variant="rounded" />
          </div>
        </div>
      </div>
    </>
  );
}

export function QuoteSkeleton(props: PropTypes) {
  const { type, expanded, tag = false } = props;
  const quoteSummary = (
    <div className="quote-summary">
      <div className="token-amount">
        <ChainToken loading size="medium" chainImage="" tokenImage="" />
        <Divider size={8} direction="horizontal" />
        <div className="token-amount__label">
          <Skeleton height={10} width={60} variant="rounded" />
          <Divider size={4} />
          <Skeleton height={15} width={148} variant="rounded" />
        </div>
      </div>
      <Skeleton height={12} width={64} variant="rounded" />
    </div>
  );

  return (
    <Container>
      <div className="cost-and-tag">
        <div className="cost">
          <Skeleton width={60} height={10} variant="rounded" />
          <Divider size={4} direction="horizontal" />
          <Skeleton width={60} height={10} variant="rounded" />
          <Divider size={4} direction="horizontal" />
          <Skeleton width={60} height={10} variant="rounded" />
        </div>
        {tag && <Skeleton height={22} width={100} variant="rounded" />}
      </div>
      {type === 'basic' && (
        <div className="basic-summary">
          <Skeleton height={15} width={148} variant="rounded" />
        </div>
      )}
      {type === 'list-item' && (
        <div className="output">
          <div className="output__token-info">
            <ChainToken loading size="medium" chainImage="" tokenImage="" />
            <Divider direction="horizontal" size={4} />
            <Skeleton height={15} width={150} variant="rounded" />
          </div>
          <Divider size={4} />
          <Skeleton height={10} width={184} variant="rounded" />
        </div>
      )}
      {type === 'swap-preview' && (
        <>
          <Divider size={4} />
          <div className="swap-preview">
            {quoteSummary}
            <div className="quote-summary__separator" />
            {quoteSummary}
          </div>
        </>
      )}
      <div className="chains">
        <Skeleton height={15} width={321} variant="rounded" />
      </div>

      {expanded && (
        <div className="steps">
          <Divider size={20} />
          <StepSkeleton />
          <StepSkeleton />
          <StepSkeleton separator={false} />
        </div>
      )}
    </Container>
  );
}
