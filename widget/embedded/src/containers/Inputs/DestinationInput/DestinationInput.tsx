import type { PropTypes } from './DestinationInput.type';

import { i18n } from '@lingui/core';
import { Divider, SwapInput } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { errorMessages } from '../../../constants/errors';
import { navigationRoutes } from '../../../constants/navigationRoutes';
import {
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../../constants/routing';
import { useAppStore } from '../../../store/AppStore';
import { useQuoteStore } from '../../../store/quote';
import { getContainer } from '../../../utils/common';
import { numberToString } from '../../../utils/numbers';
import { getPriceImpact, getPriceImpactLevel } from '../../../utils/quote';
import { canComputePriceImpact } from '../../../utils/swap';
import {
  FromContainer,
  swapInputStyles,
} from '../SourceInput/SourceInput.styles';
import { SwapInputLabel } from '../SwapInputLabel';

export function DestinationInput(props: PropTypes) {
  const { fetchingQuote, onClickToken } = props;
  const {
    fetchStatus: fetchingMetaStatus,
    selectedWallets: { destination: selectedDestinationWallet },
  } = useAppStore();
  const {
    toToken,
    toBlockchain,
    inputAmount,
    inputUsdValue,
    outputAmount,
    outputUsdValue,
    selectedQuote,
  } = useQuoteStore();
  const { getWalletInfo } = useWallets();
  const navigate = useNavigate();
  const priceImpactOutputCanNotBeComputed = !canComputePriceImpact(
    selectedQuote,
    inputAmount,
    outputUsdValue
  );

  const percentageChange =
    !inputUsdValue || !outputUsdValue || !outputUsdValue.gt(0)
      ? null
      : getPriceImpact(inputUsdValue.toString(), outputUsdValue.toString());

  const relatedWallet = selectedDestinationWallet
    ? {
        ...selectedDestinationWallet,
        image:
          'type' in selectedDestinationWallet
            ? getWalletInfo(selectedDestinationWallet.type).img
            : undefined,
      }
    : undefined;

  const onClickWallet = () => {
    navigate(
      toBlockchain
        ? navigationRoutes.destinationWallet
        : `../${navigationRoutes.wallets}`
    );
  };

  return (
    <FromContainer>
      <SwapInputLabel
        label={i18n.t('To')}
        onClickWallet={onClickWallet}
        relatedWallet={relatedWallet}
      />
      <Divider direction="vertical" size={2} />
      <SwapInput
        mode="To"
        id="widget-swap-to-input"
        style={swapInputStyles}
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
        onClickToken={onClickToken}
        disabled={fetchingMetaStatus === 'failed'}
        loading={fetchingMetaStatus === 'loading'}
        tooltipContainer={getContainer()}
      />
    </FromContainer>
  );
}
