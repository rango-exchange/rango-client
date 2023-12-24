import type { PropTypes } from './QuoteSummarySkeleton.types';

import { ChainToken, Divider, Skeleton } from '@rango-dev/ui';
import React from 'react';

import {
  BasicSummary,
  Cost,
  CostAndTag,
  Output,
  OutputTokenInfo,
  QuoteSummary,
  QuoteSummarySeparator,
  SwapPreview,
  TokenAmount,
  TokenAmountLabel,
} from './QuoteSummarySkeleton.styles';

export function QuoteSummarySkeleton(props: PropTypes) {
  const { type, tag = false } = props;
  const quotePreview = (
    <QuoteSummary>
      <TokenAmount>
        <ChainToken loading size="medium" chainImage="" tokenImage="" />
        <Divider size={8} direction="horizontal" />
        <TokenAmountLabel>
          <Skeleton height={10} width={60} variant="rounded" />
          <Divider size={4} />
          <Skeleton height={15} variant="rounded" />
        </TokenAmountLabel>
      </TokenAmount>
      <Skeleton height={12} width={64} variant="rounded" />
    </QuoteSummary>
  );

  return (
    <div>
      <CostAndTag>
        <Cost>
          <Skeleton width={60} height={10} variant="rounded" />
          <Divider size={4} direction="horizontal" />
          <Skeleton width={60} height={10} variant="rounded" />
          <Divider size={4} direction="horizontal" />
          <Skeleton width={60} height={10} variant="rounded" />
        </Cost>
        {tag && <Skeleton height={22} width={100} variant="rounded" />}
      </CostAndTag>
      {type === 'basic' && (
        <BasicSummary>
          <Skeleton height={15} width={148} variant="rounded" />
        </BasicSummary>
      )}
      {type === 'list-item' && (
        <Output>
          <OutputTokenInfo>
            <ChainToken loading size="medium" chainImage="" tokenImage="" />
            <Divider direction="horizontal" size={4} />
            <Skeleton height={15} width={150} variant="rounded" />
          </OutputTokenInfo>
          <Divider size={4} />
          <Skeleton height={10} width={184} variant="rounded" />
        </Output>
      )}
      {type === 'swap-preview' && (
        <>
          <Divider size={4} />
          <SwapPreview>
            {quotePreview}
            <QuoteSummarySeparator />
            {quotePreview}
          </SwapPreview>
        </>
      )}
    </div>
  );
}
