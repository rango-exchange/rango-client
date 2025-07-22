import type { PropTypes } from './Inputs.types';

import { i18n } from '@lingui/core';
import { SwapInput } from '@arlert-dev/ui';
import BigNumber from 'bignumber.js';
import React from 'react';

import { SwitchFromAndToButton } from '../../components/SwitchFromAndTo';
import { errorMessages } from '../../constants/errors';
import { ZERO } from '../../constants/numbers';
import {
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../constants/routing';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { getContainer } from '../../utils/common';
import { numberToString } from '../../utils/numbers';
import { getPriceImpact, getPriceImpactLevel } from '../../utils/quote';
import { canComputePriceImpact } from '../../utils/swap';
import { formatBalance, isFetchingBalance } from '../../utils/wallets';

import { Container, FromContainer } from './Inputs.styles';

export function Inputs(props: PropTypes) {
  const { fetchingQuote, fetchMetaStatus, onClickToken, isExpandable } = props;
  const {
    fromToken,
    fromBlockchain,
    toToken,
    toBlockchain,
    setInputAmount,
    sanitizeInputAmount,
    inputAmount,
    inputUsdValue,
    outputAmount,
    outputUsdValue,
    selectedQuote,
  } = useQuoteStore();
  const { connectedWallets, getBalanceFor } = useAppStore();
  const fromTokenBalance = fromToken ? getBalanceFor(fromToken) : null;
  const fromTokenFormattedBalance =
    formatBalance(fromTokenBalance)?.amount ?? '0';

  const fromBalanceAmount = fromTokenBalance
    ? new BigNumber(fromTokenBalance.amount).shiftedBy(
        -fromTokenBalance.decimals
      )
    : ZERO;

  const fetchingBalance =
    !!fromBlockchain &&
    isFetchingBalance(connectedWallets, fromBlockchain.name);

  const priceImpactInputCanNotBeComputed = !canComputePriceImpact(
    selectedQuote,
    inputAmount,
    inputUsdValue
  );

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
      <FromContainer>
        <SwapInput
          label={i18n.t('From')}
          id="widget-swap-from"
          mode="From"
          onInputChange={setInputAmount}
          onInputBlur={sanitizeInputAmount}
          balance={fromTokenFormattedBalance}
          chain={{
            displayName: fromBlockchain?.displayName || '',
            image: fromBlockchain?.logo,
          }}
          token={{
            displayName: fromToken?.symbol || '',
            image: fromToken?.image,
            securityWarning: !!fromToken?.warning,
          }}
          onClickToken={() => onClickToken('from')}
          price={{
            value: inputAmount,
            usdValue: priceImpactInputCanNotBeComputed
              ? undefined
              : numberToString(
                  inputUsdValue,
                  USD_VALUE_MIN_DECIMALS,
                  USD_VALUE_MAX_DECIMALS
                ),
            realUsdValue: priceImpactInputCanNotBeComputed
              ? undefined
              : inputUsdValue?.toString(),
            error: priceImpactInputCanNotBeComputed
              ? errorMessages().unknownPriceError.impactTitle
              : undefined,
          }}
          disabled={fetchMetaStatus === 'failed'}
          loading={fetchMetaStatus === 'loading'}
          loadingBalance={fetchingBalance}
          tooltipContainer={getContainer()}
          onSelectMaxBalance={() => {
            const tokenBalanceReal = numberToString(
              fromBalanceAmount,
              fromTokenBalance?.decimals
            );

            // if a token hasn't any value, we will reset the input by setting an empty string.
            const nextInputAmount = !!fromTokenBalance?.amount
              ? tokenBalanceReal.split(',').join('')
              : '';

            setInputAmount(nextInputAmount);
          }}
          anyWalletConnected={connectedWallets.length > 0}
        />
        <SwitchFromAndToButton />
      </FromContainer>
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
