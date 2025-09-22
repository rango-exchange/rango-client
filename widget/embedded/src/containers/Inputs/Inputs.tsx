import type { PropTypes } from './Inputs.types';

import { i18n } from '@lingui/core';
import { SwapInput } from '@rango-dev/ui';
import React from 'react';

import { errorMessages } from '../../constants/errors';
import {
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../constants/routing';
import { useQuoteStore } from '../../store/quote';
import { getContainer } from '../../utils/common';
import { numberToString } from '../../utils/numbers';
import { getPriceImpact, getPriceImpactLevel } from '../../utils/quote';
import { canComputePriceImpact } from '../../utils/swap';

import { Container } from './Inputs.styles';
import { SourceInput } from './SourceInput/SourceInput';

export function Inputs(props: PropTypes) {
  const { fetchingQuote, fetchMetaStatus, onClickToken, isExpandable } = props;
  const {
    toToken,
    toBlockchain,
    inputAmount,
    inputUsdValue,
    outputAmount,
    outputUsdValue,
    selectedQuote,
  } = useQuoteStore();

  const priceImpactOutputCanNotBeComputed = !canComputePriceImpact(
    selectedQuote,
    inputAmount,
    outputUsdValue
  );

  const percentageChange =
    !inputUsdValue || !outputUsdValue || !outputUsdValue.gt(0)
      ? null
      : getPriceImpact(inputUsdValue.toString(), outputUsdValue.toString());

  return (
    <Container>
      <SourceInput onClickToken={() => onClickToken('from')} />
      <SwapInput
        sharpBottomStyle={!isExpandable && (!!selectedQuote || fetchingQuote)}
        label={i18n.t('To')}
        mode="To"
        id="widget-swap-to-input"
        fetchingQuote={fetchingQuote}
        chain={{
          displayName: toBlockchain?.displayName || '',
          image: toBlockchain?.logo,
        }}
        token={{
          displayName: toToken?.symbol || '',
          image: toToken?.image,
          securityWarning: !!toToken?.warning,
        }}
        percentageChange={numberToString(
          getPriceImpact(inputUsdValue, outputUsdValue),
          PERCENTAGE_CHANGE_MIN_DECIMALS,
          PERCENTAGE_CHANGE_MAX_DECIMALS
        )}
        warningLevel={getPriceImpactLevel(percentageChange ?? 0)}
        price={{
          value: numberToString(
            outputAmount,
            TOKEN_AMOUNT_MIN_DECIMALS,
            TOKEN_AMOUNT_MAX_DECIMALS
          ),
          usdValue: priceImpactOutputCanNotBeComputed
            ? undefined
            : numberToString(
                outputUsdValue,
                USD_VALUE_MIN_DECIMALS,
                USD_VALUE_MAX_DECIMALS
              ),
          realValue: outputAmount?.toString(),
          realUsdValue: priceImpactOutputCanNotBeComputed
            ? undefined
            : outputUsdValue?.toString(),
          error: priceImpactOutputCanNotBeComputed
            ? errorMessages().unknownPriceError.impactTitle
            : undefined,
        }}
        onClickToken={() => onClickToken('to')}
        disabled={fetchMetaStatus === 'failed'}
        loading={fetchMetaStatus === 'loading'}
        tooltipContainer={getContainer()}
      />
    </Container>
  );
}
