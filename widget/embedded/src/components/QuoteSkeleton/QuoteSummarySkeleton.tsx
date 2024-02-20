import type { PropTypes } from './QuoteSummarySkeleton.types';

import { ChainToken, Divider, Skeleton } from '@rango-dev/ui';
import React from 'react';

import { Line } from '../Quote/Quote.styles';

import {
  BasicSummary,
  FlexContent,
  Output,
  OutputTokenInfo,
  QuoteSummary,
  QuoteSummarySeparator,
  RowStyle,
  SwapPreview,
  TokenAmount,
  TokenAmountLabel,
} from './QuoteSummarySkeleton.styles';

export function QuoteSummarySkeleton(props: PropTypes) {
  const { type, tagHidden = true } = props;
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
  const showAllRoutesSkeleton = type === 'basic' && !tagHidden;

  return (
    <div>
      {!tagHidden && (
        <>
          <FlexContent>
            <Skeleton width={65} height={14} variant="rounded" />
            <Divider size={4} direction="horizontal" />
            <Skeleton width={65} height={14} variant="rounded" />
            <Divider size={4} direction="horizontal" />
            <Skeleton width={65} height={14} variant="rounded" />
          </FlexContent>
          <Line />
          {!showAllRoutesSkeleton && <Divider size={4} />}
        </>
      )}
      <div className={RowStyle()}>
        <FlexContent>
          <Skeleton width={60} height={10} variant="rounded" />
          <Divider size={4} direction="horizontal" />
          <Skeleton width={60} height={10} variant="rounded" />
          <Divider size={4} direction="horizontal" />
          <Skeleton width={60} height={10} variant="rounded" />
        </FlexContent>
        {showAllRoutesSkeleton && (
          <Skeleton width={100} height={22} variant="rounded" />
        )}
      </div>

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
          <Divider size={10} />
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
