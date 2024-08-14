import type { TooltipContentProps } from './FullExpandedQuote.types.js';

import { i18n } from '@lingui/core';
import React from 'react';

import { ChevronRightIcon } from '../../icons/index.js';
import { Image } from '../common/index.js';
import { Divider } from '../Divider/index.js';
import { QuoteCost } from '../QuoteCost/index.js';
import { Typography } from '../Typography/index.js';

import {
  FlexCenter,
  Icon,
  SwapperContainer,
  SwapperImage,
  TooltipContainer,
  TooltipFooter,
  TooltipHeader,
} from './FullExpandedQuote.styles.js';
import { TokenSection } from './FullExpandedQuote.TokenSection.js';

export function TooltipContent(props: TooltipContentProps) {
  const { internalSwaps, time, fee, alerts } = props;
  const hasInternalSwaps = !!internalSwaps.length;
  const hasFooter = hasInternalSwaps || !!alerts;
  return (
    <TooltipContainer>
      <TooltipHeader hasFooter={hasFooter}>
        <QuoteCost fee={fee} time={time} />
      </TooltipHeader>
      {hasFooter && (
        <TooltipFooter>
          {hasInternalSwaps && (
            <>
              <Typography size="xsmall" variant="body">
                {i18n.t('Aggregated Transaction')}
              </Typography>
              <FlexCenter
                style={{
                  padding: '2px',
                }}>
                {internalSwaps.map((internalSwap, index, arr) => {
                  const key = `internal-item-${index}`;
                  const isLastItem = index === arr.length - 1;
                  return (
                    <FlexCenter key={key}>
                      <TokenSection
                        isInternalSwap
                        size="small"
                        chainImage={internalSwap.from.chain.image}
                        tokenImage={internalSwap.from.token?.image || ''}
                        name={internalSwap.from.token?.displayName}
                        amount={internalSwap.from.price?.value}
                      />
                      <Icon>
                        <ChevronRightIcon color="black" />
                      </Icon>
                      <SwapperContainer
                        style={{
                          paddingBottom: '10px',
                        }}>
                        <SwapperImage>
                          <Image
                            size={16}
                            type="circular"
                            src={internalSwap.swapper.image}
                          />
                        </SwapperImage>
                        <Divider size={2} />
                        <Typography size="xsmall" variant="body" align="center">
                          {internalSwap.swapper.displayName}
                        </Typography>
                      </SwapperContainer>
                      <Icon>
                        <ChevronRightIcon color="black" />
                      </Icon>
                      {isLastItem && (
                        <>
                          <TokenSection
                            isInternalSwap
                            size="small"
                            chainImage={internalSwap.to.chain.image}
                            tokenImage={internalSwap.to.token?.image || ''}
                            name={internalSwap.to.token?.displayName}
                            amount={internalSwap.to.price?.value}
                          />
                        </>
                      )}
                    </FlexCenter>
                  );
                })}
              </FlexCenter>
            </>
          )}
          {alerts}
        </TooltipFooter>
      )}
    </TooltipContainer>
  );
}
