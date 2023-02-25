import { PendingSwap } from '@rango-dev/ui/dist/containers/History/types';
import { WalletTypeAndAddress, SwapSavedSettings } from '@rango-dev/ui/dist/types/swaps';
import BigNumber from 'bignumber.js';
import { BestRouteResponse, SwapperMeta, SwapResult } from 'rango-sdk';
import { Account } from '../store/wallets';
import { ZERO } from '../constants/numbers';
import { numberToString } from './numbers';

export function getOutputRatio(inputUsdValue: BigNumber, outputUsdValue: BigNumber) {
  if (inputUsdValue.lte(ZERO) || outputUsdValue.lte(ZERO)) return 0;
  return outputUsdValue.div(inputUsdValue).minus(1).multipliedBy(100);
}

export function outputRatioHasWarning(inputUsdValue: BigNumber, outputRatio: BigNumber | 0) {
  return (
    (parseInt(outputRatio.toFixed(2) || '0') <= -10 && inputUsdValue.gte(new BigNumber(400))) ||
    (parseInt(outputRatio.toFixed(2) || '0') <= -5 && inputUsdValue.gte(new BigNumber(1000)))
  );
}

export function hasLimitError(bestRoute: BestRouteResponse | null): boolean {
  return (
    (bestRoute?.result?.swaps || []).filter((swap) => {
      const minimum = !!swap.fromAmountMinValue ? new BigNumber(swap.fromAmountMinValue) : null;
      const maximum = !!swap.fromAmountMaxValue ? new BigNumber(swap.fromAmountMaxValue) : null;
      const isExclusive = swap.fromAmountRestrictionType === 'EXCLUSIVE';
      if (isExclusive) {
        return minimum?.gte(swap.fromAmount) || maximum?.lte(swap.fromAmount);
      } else {
        return minimum?.gt(swap.fromAmount) || maximum?.lt(swap.fromAmount);
      }
    }).length > 0
  );
}

export function LimitErrorMessage(bestRoute: BestRouteResponse | null): {
  swap: SwapResult | null;
  fromAmountRangeError: string;
  recommendation: string;
} {
  if (!bestRoute) return { swap: null, fromAmountRangeError: '', recommendation: '' };
  const swap = (bestRoute?.result?.swaps || []).filter((swap) => {
    const minimum = !!swap.fromAmountMinValue ? new BigNumber(swap.fromAmountMinValue) : null;
    const maximum = !!swap.fromAmountMaxValue ? new BigNumber(swap.fromAmountMaxValue) : null;
    const isExclusive = swap.fromAmountRestrictionType === 'EXCLUSIVE';
    if (isExclusive) {
      return minimum?.gte(swap.fromAmount) || maximum?.lte(swap.fromAmount);
    } else {
      return minimum?.gt(swap.fromAmount) || maximum?.lt(swap.fromAmount);
    }
  });
  if (!swap) return { swap: null, fromAmountRangeError: '', recommendation: '' };
  const minimum = !!swap.fromAmountMinValue ? new BigNumber(swap.fromAmountMinValue) : null;
  const maximum = !!swap.fromAmountMaxValue ? new BigNumber(swap.fromAmountMaxValue) : null;
  const isExclusive = swap.fromAmountRestrictionType === 'EXCLUSIVE';

  let fromAmountRangeError = '';
  let recommendation = '';
  if (!isExclusive && !!minimum && minimum.gt(swap.fromAmount)) {
    fromAmountRangeError = `Required: >= ${numberToString(minimum)} ${swap.from.symbol}`;
    recommendation = 'Increase your swap amount';
  } else if (isExclusive && !!minimum && minimum.gte(swap.fromAmount)) {
    fromAmountRangeError = `Required: > ${numberToString(minimum)} ${swap.from.symbol}`;
    recommendation = 'Increase your swap amount';
  }

  if (!isExclusive && !!maximum && maximum.lt(swap.fromAmount)) {
    fromAmountRangeError = `Required: <= ${numberToString(maximum)} ${swap.from.symbol}`;
    recommendation = 'Decrease your swap amount';
  } else if (isExclusive && !!maximum && maximum.lte(swap.fromAmount)) {
    fromAmountRangeError = `Required: < ${numberToString(maximum)} ${swap.from.symbol}`;
    recommendation = 'Decrease your swap amount';
  }

  return { swap, fromAmountRangeError, recommendation };
}

export function getSwapButtonTitle(
  accounts: Account[],
  loading: boolean,
  hasLimitError: boolean,
  highValueLoss: boolean,
  priceImpactCanNotBeComputed: boolean,
  needsToWarnEthOnPath: boolean,
): string {
  if (loading) return 'Finding Best Route...';

  if (accounts.length == 0) return 'Connect Wallet';
  else if (hasLimitError) return 'Limit Error';
  else if (highValueLoss) return 'Price impact is too high!';
  else if (priceImpactCanNotBeComputed) return 'USD price is unknown, price impact might be high!';
  else if (needsToWarnEthOnPath) return 'The route goes through Ethereum. Continue?';
  else return 'Swap';
}

export function canComputePriceImpact(
  bestRoute: BestRouteResponse | null,
  inputAmount: string,
  inputUsdValue: BigNumber,
  outputUsdValue: BigNumber,
) {
  return !(
    (inputUsdValue.lte(ZERO) || outputUsdValue.lte(ZERO)) &&
    !!bestRoute?.result &&
    !!inputAmount &&
    inputAmount !== '0' &&
    parseFloat(inputAmount || '0') !== 0
  );
}

export function calculatePendingSwap(
  inputAmount: string,
  bestRoute: BestRouteResponse,
  wallets: { [p: string]: WalletTypeAndAddress },
  settings: SwapSavedSettings,
  validateBalanceOrFee: boolean,
): PendingSwap {
  const simulationResult = bestRoute.result;
  if (!simulationResult) throw Error('Simulation result should not be null');

  return {
    creationTime: new Date().getTime().toString(),
    finishTime: null,
    requestId: bestRoute.requestId || '',
    inputAmount: inputAmount,
    wallets,
    status: 'running',
    isPaused: false,
    extraMessage: null,
    extraMessageSeverity: null,
    extraMessageDetail: null,
    extraMessageErrorCode: null,
    networkStatusExtraMessage: null,
    networkStatusExtraMessageDetail: null,
    lastNotificationTime: null,
    settings: settings,
    simulationResult: simulationResult,
    validateBalanceOrFee,
    //TODO: finalize PendingSwap type and remove ts-ignore
    //@ts-ignore
    steps:
      bestRoute.result?.swaps?.map((s, i) => ({
        id: i + 1,
        fromBlockchain: s.from.blockchain,
        fromSymbol: s.from.symbol,
        fromSymbolAddress: s.from.address,
        fromDecimals: s.from.decimals,
        fromAmountPrecision: s.fromAmountPrecision,
        fromAmountMinValue: s.fromAmountMinValue,
        fromAmountMaxValue: s.fromAmountMaxValue,
        toBlockchain: s.to.blockchain,
        fromLogo: s.from.logo,
        toSymbol: s.to.symbol,
        toSymbolAddress: s.to.address,
        toDecimals: s.to.decimals,
        toLogo: s.to.logo,
        startTransactionTime: new Date().getTime(),
        swapperId: s.swapperId,
        expectedOutputAmountHumanReadable: s.toAmount,
        outputAmount: null,
        status: 'created',
        networkStatus: null,
        executedTransactionId: null,
        externalTransactionId: null,
        explorerUrl: null,
        trackingCode: null,
        cosmosTransaction: null,
        solanaTransaction: null,
        starknetTransaction: null,
        starknetApprovalTransaction: null,
        tronTransaction: null,
        tronApprovalTransaction: null,
        evmTransaction: null,
        evmApprovalTransaction: null,
        transferTransaction: null,
        diagnosisUrl: null,
        internalSteps: null,
        fromBlockchainLogo: '',
        toBlockchainLogo: '',
        swapperLogo: '',
        swapperType: '',
      })) || [],
  };
}

export function requiredWallets(route: BestRouteResponse | null) {
  const wallets: string[] = [];

  route?.result?.swaps.forEach((swap) => {
    const currentStepFromBlockchain = swap.from.blockchain;
    const currentStepToBlockchain = swap.to.blockchain;
    let lastAddedWallet = wallets[wallets.length - 1];
    if (currentStepFromBlockchain != lastAddedWallet) wallets.push(currentStepFromBlockchain);
    lastAddedWallet = wallets[wallets.length - 1];
    if (currentStepToBlockchain != lastAddedWallet) wallets.push(currentStepToBlockchain);
  });
  return wallets;
}
