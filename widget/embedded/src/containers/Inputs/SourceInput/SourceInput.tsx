import type { PropTypes } from './SourceInput.types';

import { i18n } from '@lingui/core';
import { Divider, SwapInput } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SwitchFromAndToButton } from '../../../components/SwitchFromAndTo';
import { errorMessages } from '../../../constants/errors';
import { navigationRoutes } from '../../../constants/navigationRoutes';
import { ZERO } from '../../../constants/numbers';
import {
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../../constants/routing';
import { useAppStore } from '../../../store/AppStore';
import { useQuoteStore } from '../../../store/quote';
import { getContainer } from '../../../utils/common';
import { numberToString } from '../../../utils/numbers';
import { canComputePriceImpact } from '../../../utils/swap';
import { formatBalance, isFetchingBalance } from '../../../utils/wallets';
import { SelectedWalletButton } from '../SelectedWallet/SelectedWalletButton';
import { SwapInputLabel } from '../SwapInputLabel/SwapInputLabel';

import { MaxBalance } from './MaxBalance/MaxBalance';
import { FromContainer } from './SourceInput.styles';

export function SourceInput(props: PropTypes) {
  const { onClickToken } = props;
  const {
    connectedWallets,
    getBalanceFor,
    fetchStatus: fetchingMetaStatus,
  } = useAppStore();
  const sourceWallet = useAppStore().selectedWallet('source');
  const {
    fromToken,
    fromBlockchain,
    inputAmount,
    inputUsdValue,
    selectedQuote,
    setInputAmount,
    sanitizeInputAmount,
  } = useQuoteStore();
  const { getWalletInfo } = useWallets();
  const navigate = useNavigate();
  const relatedWallet = sourceWallet
    ? {
        ...sourceWallet,
        image: getWalletInfo(sourceWallet.walletType).img,
      }
    : undefined;
  const fetchingBalance = fromToken
    ? isFetchingBalance(connectedWallets, fromToken.blockchain)
    : false;

  const fromTokenBalance = fromToken ? getBalanceFor(fromToken) : null;
  const fromTokenFormattedBalance = formatBalance(fromTokenBalance)?.amount;

  const fromBalanceAmount = fromTokenBalance
    ? new BigNumber(fromTokenBalance.amount).shiftedBy(
        -fromTokenBalance.decimals
      )
    : ZERO;

  const priceImpactInputCanNotBeComputed = !canComputePriceImpact(
    selectedQuote,
    inputAmount,
    inputUsdValue
  );

  const setMaxBalanceAsInputAmount = () => {
    const tokenBalanceReal = numberToString(
      fromBalanceAmount,
      fromTokenBalance?.decimals
    );

    // if a token hasn't any value, we will reset the input by setting an empty string.
    const nextInputAmount = !!fromTokenBalance?.amount
      ? tokenBalanceReal.split(',').join('')
      : '';

    setInputAmount(nextInputAmount);
  };

  const onClickWallet = () => {
    navigate(
      fromBlockchain
        ? navigationRoutes.sourceWallet
        : `../${navigationRoutes.wallets}`
    );
  };

  return (
    <FromContainer>
      <SwapInputLabel
        label={i18n.t('From')}
        suffix={
          <SelectedWalletButton
            onClickWallet={onClickWallet}
            relatedWallet={relatedWallet}
          />
        }
      />
      <Divider direction="vertical" size={2} />
      <SwapInput
        id="widget-swap-from"
        moreInfo={
          <MaxBalance
            loading={fetchingBalance}
            balance={fromTokenFormattedBalance}
            onClickMaxBalance={setMaxBalanceAsInputAmount}
          />
        }
        mode="From"
        onInputChange={setInputAmount}
        onInputBlur={sanitizeInputAmount}
        chain={{
          displayName: fromBlockchain?.displayName || '',
          image: fromBlockchain?.logo,
        }}
        token={{
          displayName: fromToken?.symbol || '',
          image: fromToken?.image,
          securityWarning: !!fromToken?.warning,
        }}
        onClickToken={onClickToken}
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
        disabled={fetchingMetaStatus === 'failed'}
        loading={fetchingMetaStatus === 'loading'}
        tooltipContainer={getContainer()}
      />
      <SwitchFromAndToButton />
    </FromContainer>
  );
}
