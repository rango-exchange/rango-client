import type { PropTypes, Tokens } from './SwapMetrics.types';

import { i18n } from '@lingui/core';
import { IconButton, ReverseIcon, Skeleton, Typography } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';

import {
  formatTokenValueInUsd,
  getSlippageColor,
  getUsdExchangeRate,
} from './SwapMetrics.helpers';
import {
  Container,
  Rate,
  ROTATE_ANIMATION_DURATION,
} from './SwapMetrics.styles';

export function SwapMetrics(props: PropTypes) {
  const {
    slippage,
    customSlippage,
    slippageError,
    slippageWarning,
    quoteTokensRate,
    changeQuoteTokensRate,
  } = useAppStore();
  const { quoteError, quoteWarning, fromToken, toToken, quote, loading } =
    props;
  const currentSlippage = customSlippage !== null ? customSlippage : slippage;
  const { mode } = useTheme({});
  const [tokens, setTokens] = useState<Tokens>({
    to: toToken,
    from: fromToken,
  });
  useEffect(() => {
    if (quote) {
      const from = quote.swaps[0].from;
      const to = quote.swaps[quote.swaps.length - 1].to;
      setTokens({
        from: quoteTokensRate === 'default' ? from : to,
        to: quoteTokensRate === 'default' ? to : from,
      });
    } else {
      setTokens({
        from: quoteTokensRate === 'default' ? fromToken : toToken,
        to: quoteTokensRate === 'default' ? toToken : fromToken,
      });
    }
  }, [fromToken, toToken, quote, quoteTokensRate]);

  const isDarkTheme = mode === 'dark';

  const error = {
    quoteError,
    slippageError,
  };
  const Warning = {
    quoteWarning,
    slippageWarning,
  };

  const usdExchangeRate = getUsdExchangeRate(
    tokens.to.usdPrice,
    tokens.from.usdPrice
  );

  return (
    <Container>
      <Typography
        variant="body"
        size="small"
        color={getSlippageColor(error, Warning, isDarkTheme)}>
        {i18n.t('Slippage:')} {currentSlippage}%
      </Typography>
      {loading ? (
        <Skeleton height={16} width={104} variant="rounded" />
      ) : (
        <Rate>
          <Typography className="rate-text" variant="body" size="small">
            1 {tokens.to.symbol}
          </Typography>
          <IconButton
            id="widget-change-rate-button"
            onClick={(event) => {
              const button = event.currentTarget;
              button.classList.add('rotate');
              setTimeout(() => {
                button.classList.remove('rotate');
              }, ROTATE_ANIMATION_DURATION);
              changeQuoteTokensRate();
            }}>
            <ReverseIcon size={14} color="secondary" />
          </IconButton>
          <Typography className="rate-text" variant="body" size="small">
            {usdExchangeRate} {tokens.from.symbol}
          </Typography>
          {tokens.from.usdPrice && (
            <Typography color="neutral600" variant="body" size="small">
              ~{formatTokenValueInUsd(usdExchangeRate, tokens.from.usdPrice)}
            </Typography>
          )}
        </Rate>
      )}
    </Container>
  );
}
