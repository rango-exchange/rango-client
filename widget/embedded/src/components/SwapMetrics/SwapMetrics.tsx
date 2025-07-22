import type { PropTypes } from './SwapMetrics.types';

import { i18n } from '@lingui/core';
import {
  IconButton,
  ReverseIcon,
  Skeleton,
  Tooltip,
  Typography,
} from '@arlert-dev/ui';
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
  const {
    quoteError,
    quoteWarning,
    fromToken: initialFromToken,
    toToken: initialToToken,
    quote,
    loading,
  } = props;
  const currentSlippage = customSlippage !== null ? customSlippage : slippage;
  const { mode } = useTheme({});
  const slippageValidation = getSlippageValidation(currentSlippage);
  const isDarkTheme = mode === 'dark';
  const isDefaultRate = quoteTokensRate === 'default';

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

  const sourceToken = quote?.swaps[0].from || initialFromToken;
  const destinationToken =
    quote?.swaps[quote?.swaps.length - 1].to || initialToToken;

  const fromToken = isDefaultRate ? sourceToken : destinationToken;
  const toToken = isDefaultRate ? destinationToken : sourceToken;

  const fromAmount = Number(
    isDefaultRate ? quote?.outputAmount : quote?.requestAmount
  );
  const toAmount = Number(
    isDefaultRate ? quote?.requestAmount : quote?.outputAmount
  );

  const fromTokenUsdPrice = fromAmount || fromToken.usdPrice;
  const toTokenUsdPrice = toAmount || toToken.usdPrice;

  const { rawValue: rawExchangeRate, displayValue: displayExchangeRate } =
    getUsdExchangeRate({
      toTokenUsdPrice,
      fromTokenUsdPrice,
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
        fromTokenUsdPrice &&
        toTokenUsdPrice && (
          <Rate>
            <Typography className="rate-text" variant="body" size="small">
              1
            </Typography>
            <TokenName className="rate-text" variant="body" size="small">
              {toToken.symbol}
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
                  {rawExchangeRate}
                </Typography>
              }>
              <Typography className="rate-text" variant="body" size="small">
                {displayExchangeRate}
              </Typography>
            </Tooltip>

            <TokenName className="rate-text" variant="body" size="small">
              {fromToken.symbol}
            </TokenName>
            {fromToken.usdPrice && (
              <Typography color="neutral600" variant="body" size="small">
                ~
                {formatTokenValueInUsd(
                  Number(rawExchangeRate),
                  fromToken.usdPrice
                )}
              </Typography>
            )}
          </Rate>
        )
      )}
    </Container>
  );
}
