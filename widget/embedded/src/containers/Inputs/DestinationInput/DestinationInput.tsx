import type { PropTypes } from './DestinationInput.types';

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
import { Container } from '../DestinationInput/DestinationInput.styles';
import { SelectedWalletButton } from '../SelectedWallet/SelectedWalletButton';
import { SwapInputLabel } from '../SwapInputLabel/SwapInputLabel';

export function DestinationInput(props: PropTypes) {
  const { fetchingQuote, isExpandable, onClickToken } = props;
  const { fetchStatus: fetchingMetaStatus } = useAppStore();
  const destinationWallet = useAppStore().selectedWallet('destination');
  const {
    toToken,
    toBlockchain,
    inputAmount,
    inputUsdValue,
    outputAmount,
    outputUsdValue,
    selectedQuote,
    customDestination,
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

  const selectedDestinationWallet =
    customDestination && toBlockchain
      ? { address: customDestination, chain: toBlockchain.name }
      : destinationWallet;

  const relatedWallet = selectedDestinationWallet
    ? {
        ...selectedDestinationWallet,
        image:
          'walletType' in selectedDestinationWallet
            ? getWalletInfo(selectedDestinationWallet.walletType).img
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
    <Container>
      <SwapInputLabel
        label={i18n.t('To')}
        suffix={
          <SelectedWalletButton
            onClickWallet={onClickWallet}
            relatedWallet={relatedWallet}
          />
        }
      />
      <Divider direction="vertical" size={2} />
      <SwapInput
        mode="To"
        id="widget-swap-to-input"
        sharpBottomStyle={!isExpandable && (!!selectedQuote || fetchingQuote)}
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
    </Container>
  );
}
