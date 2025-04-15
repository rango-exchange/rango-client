import type { PropTypes } from './SwapMetrics.types';

import { i18n } from '@lingui/core';
import { IconButton, ReverseIcon, Skeleton, Typography } from '@rango-dev/ui';
import React from 'react';

import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';
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

  const usdExchangeRate = getUsdExchangeRate({
    fromTokenUsdPrice: Number(quote?.outputAmount) || fromToken.usdPrice,
    toTokenUsdPrice: Number(quote?.requestAmount) || toToken.usdPrice,
    quoteTokensRate,
  });
  const currentToToken = quoteTokensRate === 'default' ? toToken : fromToken;
  const currentFromToken = quoteTokensRate === 'default' ? fromToken : toToken;

  return (
    <Container>
      <Typography
        variant="body"
        size="small"
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
          <Typography className="rate-text" variant="body" size="small">
            {usdExchangeRate}
          </Typography>
          <TokenName className="rate-text" variant="body" size="small">
            {currentFromToken.symbol}
          </TokenName>
          {currentFromToken.usdPrice && (
            <Typography color="neutral600" variant="body" size="small">
              ~
              {formatTokenValueInUsd(
                usdExchangeRate,
                currentFromToken.usdPrice
              )}
            </Typography>
          )}
        </Rate>
      )}
    </Container>
  );
}
