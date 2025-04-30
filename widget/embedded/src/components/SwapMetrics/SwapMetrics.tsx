import type { PropTypes } from './SwapMetrics.types';

import { i18n } from '@lingui/core';
import {
  IconButton,
  ReverseIcon,
  Skeleton,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';
import { getContainer } from '../../utils/common';
import { getSlippageValidation } from '../../utils/settings';

import {
  formatTokenValueInUsd,
  getSlippageColor,
  getUsdExchangeRate,
} from './SwapMetrics.helpers';
import { Container, Rate, TokenName } from './SwapMetrics.styles';

export function SwapMetrics(props: PropTypes) {
  const { slippage, customSlippage, quoteTokensRate, changeQuoteTokensRate } =
    useAppStore();
  const { quoteError, quoteWarning, fromToken, toToken, quote, loading } =
    props;
  const currentSlippage = customSlippage !== null ? customSlippage : slippage;
  const { mode } = useTheme({});
  const slippageValidation = getSlippageValidation(currentSlippage);
  const isDarkTheme = mode === 'dark';

  const error = {
    quoteError,
    slippageError:
      slippageValidation?.type === 'error' ? slippageValidation.message : null,
  };
  const warning = {
    quoteWarning,
    slippageWarning:
      slippageValidation?.type === 'warning'
        ? slippageValidation.message
        : null,
  };

  const sourceToken = quote?.swaps[0].from || fromToken;
  const destinationToken = quote?.swaps[quote.swaps.length - 1].to || toToken;

  const currentToToken =
    quoteTokensRate === 'default' ? destinationToken : sourceToken;
  const currentFromToken =
    quoteTokensRate === 'default' ? sourceToken : destinationToken;
  const requestAmount =
    quoteTokensRate === 'default'
      ? Number(quote?.outputAmount)
      : Number(quote?.requestAmount);

  const outputAmount =
    quoteTokensRate === 'default'
      ? Number(quote?.requestAmount)
      : Number(quote?.outputAmount);

  const { rawValue, displayValue } = getUsdExchangeRate({
    fromTokenUsdPrice: requestAmount || currentFromToken.usdPrice,
    toTokenUsdPrice: outputAmount || currentToToken.usdPrice,
  });

  return (
    <Container>
      <Typography
        variant={!!error || !!warning ? 'label' : 'body'}
        size={!!error || !!warning ? 'medium' : 'small'}
        color={getSlippageColor({ error, warning, isDarkTheme })}>
        {i18n.t('Slippage:')} {currentSlippage}%
      </Typography>
      {loading ? (
        <Skeleton height={16} width={104} variant="rounded" />
      ) : (
        <Rate>
          <Typography className="rate-text" variant="body" size="small">
            1
          </Typography>
          <TokenName className="rate-text" variant="body" size="small">
            {currentToToken.symbol}
          </TokenName>
          <IconButton
            id="widget-home-page-change-rate-button"
            onClick={changeQuoteTokensRate}>
            <ReverseIcon size={14} color="secondary" />
          </IconButton>
          <Tooltip
            container={getContainer()}
            side="top"
            sideOffset={4}
            content={
              <Typography className="rate-text" variant="body" size="small">
                {rawValue}
              </Typography>
            }>
            <Typography className="rate-text" variant="body" size="small">
              {displayValue}
            </Typography>
          </Tooltip>

          <TokenName className="rate-text" variant="body" size="small">
            {currentFromToken.symbol}
          </TokenName>
          {currentFromToken.usdPrice && (
            <Typography color="neutral600" variant="body" size="small">
              ~
              {formatTokenValueInUsd(
                Number(displayValue),
                currentFromToken.usdPrice
              )}
            </Typography>
          )}
        </Rate>
      )}
    </Container>
  );
}
