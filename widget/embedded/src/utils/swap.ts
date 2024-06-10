/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { FeesGroup, NameOfFees } from '../constants/quote';
import type { FetchStatus, FindToken } from '../store/slices/data';
import type { ConnectedWallet } from '../store/wallets';
import type {
  ConvertedToken,
  QuoteError,
  QuoteWarning,
  RecommendedSlippages,
  SelectedQuote,
  SwapButtonState,
  Wallet,
} from '../types';
import type { WalletType } from '@rango-dev/wallets-shared';
import type {
  BestRouteRequest,
  BlockchainMeta,
  RecommendedSlippage,
  SwapFee,
  SwapResult,
  Token,
} from 'rango-sdk';
import type { PendingSwap, PendingSwapStep } from 'rango-types';

import { i18n } from '@lingui/core';
import {
  type RouteEvent,
  RouteEventType,
  type StepEvent,
} from '@rango-dev/queue-manager-rango-preset';
import BigNumber from 'bignumber.js';
import { PendingSwapNetworkStatus } from 'rango-types';

import { isValidAddress } from '../components/ConfirmWalletsModal/ConfirmWallets.helpers';
import { errorMessages } from '../constants/errors';
import { swapButtonTitles } from '../constants/messages';
import { ZERO } from '../constants/numbers';
import {
  BALANCE_MAX_DECIMALS,
  BALANCE_MIN_DECIMALS,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
} from '../constants/routing';

import { getBlockchainShortNameFor } from './meta';
import { numberToString } from './numbers';
import { getPriceImpact, getRequiredBalanceOfWallet } from './quote';
import { getQuoteWallets } from './wallets';

export function getOutputRatio(
  inputUsdValue: BigNumber | null,
  outputUsdValue: BigNumber | null
) {
  if (
    !inputUsdValue ||
    !outputUsdValue ||
    inputUsdValue.lte(ZERO) ||
    outputUsdValue.lte(ZERO)
  ) {
    return 0;
  }
  return outputUsdValue
    .div(inputUsdValue)
    .minus(1)
    .multipliedBy(100)
    .toNumber();
}

export function hasHighValueLoss(
  inputUsdValue: BigNumber | null,
  priceImpact: number
): boolean {
  return (
    ((parseInt(priceImpact.toFixed(2) || '0') <= -10 &&
      inputUsdValue?.gte(new BigNumber(400))) ||
      (parseInt(priceImpact.toFixed(2) || '0') <= -5 &&
        inputUsdValue?.gte(new BigNumber(1000)))) ??
    false
  );
}

export function hasLimitError(swaps: SwapResult[]): boolean {
  return (
    (swaps || []).filter((swap) => {
      const minimum = !!swap.fromAmountMinValue
        ? new BigNumber(swap.fromAmountMinValue)
        : null;
      const maximum = !!swap.fromAmountMaxValue
        ? new BigNumber(swap.fromAmountMaxValue)
        : null;
      const isExclusive = swap.fromAmountRestrictionType === 'EXCLUSIVE';
      if (isExclusive) {
        return minimum?.gte(swap.fromAmount) || maximum?.lte(swap.fromAmount);
      }
      return minimum?.gt(swap.fromAmount) || maximum?.lt(swap.fromAmount);
    }).length > 0
  );
}

export function getLimitErrorMessage(swaps: SwapResult[]): {
  swap: SwapResult;
  fromAmountRangeError: string;
  recommendation: string;
} {
  const swap = (swaps || []).filter((swap) => {
    const minimum = !!swap.fromAmountMinValue
      ? new BigNumber(swap.fromAmountMinValue)
      : null;
    const maximum = !!swap.fromAmountMaxValue
      ? new BigNumber(swap.fromAmountMaxValue)
      : null;
    const isExclusive = swap.fromAmountRestrictionType === 'EXCLUSIVE';
    if (isExclusive) {
      return minimum?.gte(swap.fromAmount) || maximum?.lte(swap.fromAmount);
    }
    return minimum?.gt(swap.fromAmount) || maximum?.lt(swap.fromAmount);
  })[0];

  const minimum = !!swap.fromAmountMinValue
    ? new BigNumber(swap.fromAmountMinValue)
    : null;
  const maximum = !!swap.fromAmountMaxValue
    ? new BigNumber(swap.fromAmountMaxValue)
    : null;
  const isExclusive = swap.fromAmountRestrictionType === 'EXCLUSIVE';

  let fromAmountRangeError = '';
  let recommendation = '';
  if (!isExclusive && !!minimum && minimum.gt(swap.fromAmount)) {
    fromAmountRangeError = i18n.t({
      id: 'Required: >= {min} {symbol}',
      values: {
        min: numberToString(
          minimum,
          TOKEN_AMOUNT_MIN_DECIMALS,
          TOKEN_AMOUNT_MAX_DECIMALS
        ),
        symbol: swap.from.symbol,
      },
    });
    recommendation = errorMessages().bridgeLimitErrors.increaseAmount;
  } else if (isExclusive && !!minimum && minimum.gte(swap.fromAmount)) {
    fromAmountRangeError = i18n.t({
      id: 'Required: > {min} {symbol}',
      values: {
        min: numberToString(
          minimum,
          TOKEN_AMOUNT_MIN_DECIMALS,
          TOKEN_AMOUNT_MAX_DECIMALS
        ),
        symbol: swap.from.symbol,
      },
    });
    recommendation = errorMessages().bridgeLimitErrors.increaseAmount;
  }

  if (!isExclusive && !!maximum && maximum.lt(swap.fromAmount)) {
    fromAmountRangeError = i18n.t({
      id: 'Required: <= {max} {symbol}',
      values: {
        max: numberToString(
          maximum,
          TOKEN_AMOUNT_MIN_DECIMALS,
          TOKEN_AMOUNT_MAX_DECIMALS
        ),
        symbol: swap.from.symbol,
      },
    });
    recommendation = errorMessages().bridgeLimitErrors.decreaseAmount;
  } else if (isExclusive && !!maximum && maximum.lte(swap.fromAmount)) {
    fromAmountRangeError = i18n.t({
      id: 'Required: < {max} {symbol}',
      values: {
        max: numberToString(
          maximum,
          TOKEN_AMOUNT_MIN_DECIMALS,
          TOKEN_AMOUNT_MAX_DECIMALS
        ),
        symbol: swap.from.symbol,
      },
    });
    recommendation = errorMessages().bridgeLimitErrors.decreaseAmount;
  }

  return { swap, fromAmountRangeError, recommendation };
}

export function getSwapButtonState(params: {
  fetchMetaStatus: FetchStatus;
  anyWalletConnected: boolean;
  fetchingQuote: boolean;
  inputAmount: string;
  quote: SelectedQuote | null;
  warning: QuoteWarning | null;
  error: QuoteError | null;
  needsToWarnEthOnPath: boolean;
}): SwapButtonState {
  const {
    fetchMetaStatus,
    anyWalletConnected,
    fetchingQuote,
    inputAmount,
    quote,
    warning,
    error,
    needsToWarnEthOnPath,
  } = params;
  if (fetchMetaStatus !== 'success') {
    return {
      title: swapButtonTitles().connectWallet,
      action: 'connect-wallet',
      disabled: true,
    };
  }
  if (!anyWalletConnected) {
    return {
      title: swapButtonTitles().connectWallet,
      action: 'connect-wallet',
      disabled: false,
    };
  }
  if (fetchingQuote || !quote || error || !inputAmount || inputAmount === '0') {
    return {
      title: swapButtonTitles().swap,
      action: 'confirm-swap',
      disabled: true,
    };
  } else if (warning) {
    return {
      title: swapButtonTitles().swapAnyway,
      action: 'confirm-warning',
      disabled: false,
    };
  } else if (needsToWarnEthOnPath) {
    return {
      title: swapButtonTitles().ethWarning,
      action: 'confirm-warning',
      disabled: false,
    };
  }
  return {
    title: swapButtonTitles().swap,
    action: 'confirm-swap',
    disabled: false,
  };
}

export function canComputePriceImpact(
  quote: SelectedQuote | null,
  inputAmount: string,
  usdValue: BigNumber | null
) {
  return !(
    (!usdValue || usdValue.lte(ZERO)) &&
    !!quote &&
    !!inputAmount &&
    inputAmount !== '0' &&
    parseFloat(inputAmount || '0') !== 0 &&
    !!quote
  );
}

export function getUsdFeeOfStep(
  step: SwapResult,
  findToken: FindToken
): BigNumber {
  let totalFeeInUsd = ZERO;
  for (let i = 0; i < step.fee.length; i++) {
    const fee = step.fee[i];
    if (fee.expenseType === 'DECREASE_FROM_OUTPUT') {
      continue;
    }

    const unitPrice = findToken(fee.asset)?.usdPrice || null;
    totalFeeInUsd = totalFeeInUsd.plus(
      new BigNumber(fee.amount).multipliedBy(unitPrice || 0)
    );
  }

  return totalFeeInUsd;
}

export function getTotalFeeInUsd(
  swaps: SwapResult[],
  findToken: FindToken
): BigNumber {
  return swaps.reduce(
    (totalFee: BigNumber, step) =>
      totalFee.plus(getUsdFeeOfStep(step, findToken)),
    ZERO
  );
}

export function getUsdFee(fee: SwapFee): BigNumber {
  let totalFeeInUsd = ZERO;
  totalFeeInUsd = totalFeeInUsd.plus(
    new BigNumber(fee.amount).multipliedBy(fee.price || 0)
  );

  return totalFeeInUsd;
}

export function getTotalFeesInUsd(fees: SwapFee[]): BigNumber {
  return fees.reduce(
    (totalFee: BigNumber, fee) => totalFee.plus(getUsdFee(fee)),
    ZERO
  );
}
export function getFeesGroup(swaps: SwapResult[]): FeesGroup {
  return swaps.reduce(
    (result, swap) => {
      for (const fee of swap.fee) {
        const name = fee.name as NameOfFees;
        const feeGroup =
          fee.expenseType !== 'DECREASE_FROM_OUTPUT'
            ? result.payable
            : result.nonePayable;

        feeGroup[name] = [...(feeGroup[name] || []), fee];
      }
      return result;
    },
    { payable: {}, nonePayable: {} } as FeesGroup
  );
}

export function hasHighFee(totalFeeInUsd: BigNumber | null) {
  if (!totalFeeInUsd) {
    return false;
  }
  return !totalFeeInUsd.lt(new BigNumber(30));
}

export function hasSlippageError(
  slippages: (RecommendedSlippage | null)[] | undefined
) {
  return (slippages?.filter((s) => !!s?.error)?.length || 0) > 0;
}

export function checkSlippageErrors(
  swaps: SwapResult[]
): RecommendedSlippages | null {
  const recommendedSlippages: RecommendedSlippages = new Map();
  swaps.forEach((swap, index) => {
    if (swap.recommendedSlippage?.error) {
      recommendedSlippages.set(index, swap.recommendedSlippage.slippage);
    }
  });
  if (recommendedSlippages.size > 0) {
    return recommendedSlippages;
  }
  return null;
}

export function checkSlippageWarnings(
  quote: SelectedQuote,
  userSlippage: number
): RecommendedSlippages | null {
  const recommendedSlippages: RecommendedSlippages = new Map();
  quote?.swaps.forEach((swap, index) => {
    if (
      swap.recommendedSlippage?.slippage &&
      parseFloat(swap.recommendedSlippage.slippage) > userSlippage
    ) {
      recommendedSlippages.set(index, swap.recommendedSlippage.slippage);
    }
  });
  if (recommendedSlippages.size > 0) {
    return recommendedSlippages;
  }
  return null;
}

export function getMinRequiredSlippage(swaps: SwapResult[]): string | null {
  const slippages = swaps.map((slippage) => slippage.recommendedSlippage);
  return (
    slippages
      ?.map((s) => s?.slippage || '0')
      ?.filter((s) => parseFloat(s) > 0)
      ?.sort((a, b) => parseFloat(b) - parseFloat(a))
      ?.find(() => true) || null
  );
}

export function hasProperSlippage(
  userSlippage: string,
  minRequiredSlippage: string | null
) {
  if (!minRequiredSlippage) {
    return true;
  }
  return parseFloat(userSlippage) >= parseFloat(minRequiredSlippage);
}

export function hasEnoughBalance(
  quote: SelectedQuote,
  selectedWallets: Wallet[]
) {
  const fee = quote.validationStatus;

  if (fee === null || fee.length === 0) {
    return true;
  }

  for (const wallet of selectedWallets) {
    const requiredAssets = getRequiredBalanceOfWallet(wallet, fee);
    if (!requiredAssets) {
      continue;
    }

    const enoughBalanceInWallet = requiredAssets
      .map((asset) => asset.ok)
      .reduce((previous, current) => previous && current);
    if (!enoughBalanceInWallet) {
      return false;
    }
  }

  return true;
}

export function hasEnoughBalanceAndProperSlippage(
  quote: SelectedQuote,
  selectedWallets: Wallet[],
  userSlippage: string,
  minRequiredSlippage: string | null
): boolean {
  return (
    hasEnoughBalance(quote, selectedWallets) &&
    hasProperSlippage(userSlippage, minRequiredSlippage)
  );
}

export function createQuoteRequestBody(params: {
  fromToken: Token;
  toToken: Token;
  inputAmount: string;
  wallets?: ConnectedWallet[];
  selectedWallets?: Wallet[];
  liquiditySources?: string[];
  excludeLiquiditySources?: boolean;
  disabledLiquiditySources: string[];
  slippage: number;
  affiliateRef: string | null;
  affiliatePercent: number | null;
  affiliateWallets: { [key: string]: string } | null;
  destination?: string;
  enableCentralizedSwappers?: boolean;
}): BestRouteRequest {
  const {
    fromToken,
    toToken,
    inputAmount,
    wallets,
    selectedWallets,
    disabledLiquiditySources,
    liquiditySources,
    excludeLiquiditySources,
    slippage,
    affiliateRef,
    affiliatePercent,
    affiliateWallets,
    destination,
    enableCentralizedSwappers,
  } = params;
  const selectedWalletsMap = selectedWallets?.reduce(
    (
      selectedWalletsMap: BestRouteRequest['selectedWallets'],
      selectedWallet
    ) => (
      (selectedWalletsMap[selectedWallet.chain] = selectedWallet.address),
      selectedWalletsMap
    ),
    {}
  );

  const connectedWallets: BestRouteRequest['connectedWallets'] = [];

  wallets?.forEach((wallet) => {
    connectedWallets.push({
      blockchain: wallet.chain,
      addresses: [wallet.address],
    });
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const requestBody: BestRouteRequest = {
    amount: inputAmount.toString(),
    affiliateRef: affiliateRef ?? undefined,
    affiliatePercent: affiliatePercent ?? undefined,
    affiliateWallets: affiliateWallets ?? undefined,
    from: {
      address: fromToken.address,
      blockchain: fromToken.blockchain,
      symbol: fromToken.symbol,
    },
    to: {
      address: toToken.address,
      blockchain: toToken.blockchain,
      symbol: toToken.symbol,
    },
    connectedWallets,
    selectedWallets: selectedWalletsMap ?? {},
    slippage: slippage.toString(),
    ...(destination && { destination: destination }),
    ...(excludeLiquiditySources && {
      swapperGroups: disabledLiquiditySources.concat(liquiditySources ?? []),
      swappersGroupsExclude: true,
    }),
    ...(!excludeLiquiditySources && {
      swapperGroups: liquiditySources?.filter(
        (liquiditySource) => !disabledLiquiditySources.includes(liquiditySource)
      ),
      swappersGroupsExclude: false,
    }),
    enableCentralizedSwappers,
  };
  return requestBody;
}

export function getWalletsForNewSwap(selectedWallets: Wallet[]) {
  const wallets = selectedWallets.reduce(
    (
      selectedWalletsMap: {
        [p: string]: { address: string; walletType: WalletType };
      },
      selectedWallet
    ) => (
      (selectedWalletsMap[selectedWallet.chain] = {
        address: selectedWallet.address,
        walletType: selectedWallet.walletType,
      }),
      selectedWalletsMap
    ),
    {}
  );

  return wallets;
}

export function getQuoteOutputAmount(quote: SelectedQuote) {
  return quote?.outputAmount || null;
}

export function getPercentageChange(input: string, output: string) {
  return new BigNumber(output)
    .div(new BigNumber(input))
    .minus(1)
    .multipliedBy(100)
    .toNumber();
}

export function isOutputAmountChangedALot(
  oldQuote: SelectedQuote,
  newQuote: SelectedQuote
) {
  const oldOutputAmount = getQuoteOutputAmount(oldQuote);
  const newOutputAmount = getQuoteOutputAmount(newQuote);
  if (!oldOutputAmount || !newOutputAmount) {
    return false;
  }
  const percentageChange = getPriceImpact(oldOutputAmount, newOutputAmount);
  if (!percentageChange) {
    return true;
  }

  return percentageChange <= -1;
}

export function generateBalanceWarnings(
  quote: SelectedQuote,
  selectedWallets: Wallet[],
  blockchains: BlockchainMeta[]
) {
  const fee = quote.validationStatus;
  const requiredWallets = getQuoteWallets({ filter: 'required', quote });
  const walletsSortedByRequiredWallets = selectedWallets.sort(
    (selectedWallet1, selectedWallet2) =>
      requiredWallets.indexOf(selectedWallet1.chain) -
      requiredWallets.indexOf(selectedWallet2.chain)
  );

  return walletsSortedByRequiredWallets
    .flatMap((wallet) => getRequiredBalanceOfWallet(wallet, fee) || [])
    .filter((asset) => !asset.ok)
    .map((asset) => {
      const symbol = asset.asset.symbol;
      const currentAmount = numberToString(
        new BigNumber(asset.currentAmount.amount).shiftedBy(
          -asset.currentAmount.decimals
        ),
        BALANCE_MIN_DECIMALS,
        BALANCE_MAX_DECIMALS
      );
      const requiredAmount = numberToString(
        new BigNumber(asset.requiredAmount.amount).shiftedBy(
          -asset.requiredAmount.decimals
        ),
        BALANCE_MIN_DECIMALS,
        BALANCE_MAX_DECIMALS
      );
      let reason = '';
      if (asset.reason === 'FEE') {
        reason = i18n.t(' for network fee');
      }
      if (asset.reason === 'INPUT_ASSET') {
        reason = i18n.t(' for swap');
      }
      if (asset.reason === 'FEE_AND_INPUT_ASSET') {
        reason = i18n.t(' for input and network fee');
      }
      const warningMessage = i18n.t({
        id: `Needs ≈ {requiredAmount} {symbol}{reason}, but you have {currentAmount} {symbol} in your {blockchain} wallet.`,
        values: {
          requiredAmount,
          symbol,
          reason,
          currentAmount,
          blockchain: getBlockchainShortNameFor(
            asset.asset.blockchain,
            blockchains
          ),
        },
      });
      return warningMessage;
    });
}

export function calcOutputUsdValue(
  outputAmount?: string,
  tokenPrice?: number | null
) {
  const amount = !!outputAmount ? new BigNumber(outputAmount) : ZERO;

  return amount.multipliedBy(tokenPrice || 0);
}

export function isNetworkStatusInWarningState(
  pendingSwapStep: PendingSwapStep | null
): boolean {
  return (
    !!pendingSwapStep &&
    pendingSwapStep.networkStatus !== null &&
    pendingSwapStep.networkStatus !== PendingSwapNetworkStatus.NetworkChanged
  );
}

export function getSwapMessages(
  pendingSwap: PendingSwap,
  currentStep: PendingSwapStep | null
): {
  shortMessage: string;
  detailedMessage: { content: string; long: boolean };
} {
  const textForRemove = 'bellow button or';
  let message = pendingSwap.extraMessage;
  let detailedMessage = pendingSwap.extraMessageDetail;

  if (pendingSwap.networkStatusExtraMessageDetail?.includes(textForRemove)) {
    pendingSwap.networkStatusExtraMessageDetail =
      pendingSwap.networkStatusExtraMessageDetail.replace(textForRemove, '');
  }

  const networkWarningState = isNetworkStatusInWarningState(currentStep);

  if (networkWarningState) {
    message = pendingSwap.networkStatusExtraMessage || '';
    detailedMessage = pendingSwap.networkStatusExtraMessageDetail || '';
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (currentStep?.networkStatus) {
      case PendingSwapNetworkStatus.WaitingForConnectingWallet:
        message = message || i18n.t('Waiting for connecting wallet');
        break;
      case PendingSwapNetworkStatus.WaitingForQueue:
        message =
          message || i18n.t('Waiting for other running tasks to be finished');
        break;
      case PendingSwapNetworkStatus.WaitingForNetworkChange:
        message = message || i18n.t('Waiting for changing wallet network');
        break;
      default:
        message = message || '';
        break;
    }
  }
  detailedMessage = detailedMessage || '';
  message = message || '';
  const isRpc =
    message?.indexOf('code') !== -1 && message?.indexOf('reason') !== -1;

  return {
    shortMessage: message,
    detailedMessage: { content: detailedMessage, long: isRpc },
  };
}

export function getLastConvertedTokenInFailedSwap(
  pendingSwap: PendingSwap
): ConvertedToken {
  let resultToken: ConvertedToken = null;
  if (pendingSwap.status === 'failed') {
    const lastSuccessStep = pendingSwap.steps
      .slice()
      .reverse()
      .filter((step) => step.status === 'success')[0];

    if (lastSuccessStep) {
      resultToken = {
        blockchain: lastSuccessStep.toBlockchain,
        symbol: lastSuccessStep.toSymbol,
        outputAmount: lastSuccessStep.outputAmount,
        address: lastSuccessStep.toSymbolAddress,
      };
    }
  }
  return resultToken;
}

export function shouldRetrySwap(pendingSwap: PendingSwap) {
  return pendingSwap.status === 'failed';
}

export function isConfirmSwapDisabled(
  fetching: boolean,
  showCustomDestination: boolean,
  customDestination: string | null,
  quote: SelectedQuote | null,
  selectedWallets: { walletType: string; chain: string }[],
  lastStepToBlockchain: BlockchainMeta | undefined
): boolean {
  if (!quote || fetching) {
    return true;
  }

  const allWallets = getQuoteWallets({ filter: 'all', quote });

  const requiredWallets = getQuoteWallets({ filter: 'required', quote });

  const everyWalletSelected = allWallets.every((blockchain) =>
    selectedWallets.some(
      (selectedWallet) => selectedWallet.chain === blockchain
    )
  );

  const everyRequiredWalletSelected = requiredWallets.every((wallet) =>
    selectedWallets.some((selectedWallet) => selectedWallet.chain === wallet)
  );

  const customDestinationIsValid =
    customDestination && lastStepToBlockchain
      ? isValidAddress(lastStepToBlockchain, customDestination)
      : false;

  return (
    (!showCustomDestination && !everyWalletSelected) ||
    (showCustomDestination && !customDestination) ||
    (showCustomDestination &&
      !!customDestination &&
      (!customDestinationIsValid || !everyRequiredWalletSelected))
  );
}

export function isTokensIdentical(tokenA: Token, tokenB: Token) {
  return (
    tokenA.blockchain === tokenB.blockchain &&
    tokenA.symbol === tokenB.symbol &&
    tokenA.address === tokenB.address
  );
}

export function isSwapFinished(event: RouteEvent | StepEvent) {
  return (
    event.type === RouteEventType.FAILED ||
    event.type === RouteEventType.SUCCEEDED
  );
}
