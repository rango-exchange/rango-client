import { PendingSwap } from '@rango-dev/ui/dist/containers/History/types';
import { WalletTypeAndAddress, SwapSavedSettings, SimulationValidationStatus } from '@rango-dev/ui/dist/types/swaps';
import BigNumber from 'bignumber.js';
import {
  BestRouteRequest,
  BestRouteResponse,
  RecommendedSlippage,
  SwapResult,
  Token,
} from 'rango-sdk';
import { Account } from '../store/wallets';
import { ZERO } from '../constants/numbers';
import { numberToString } from './numbers';
import { WalletType } from '@rangodev/wallets-shared';
import { getRequiredBalanceOfWallet } from './routing';
import { SelectedWallet } from './wallets';
import { Typography } from '@rangodev/ui';

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
  })[0];
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
  settings: Omit<SwapSavedSettings, 'disabledSwappersIds'>,
  validateBalanceOrFee: boolean,
  tokens: Token[],
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
    //@ts-ignore
    settings: settings,
    simulationResult: simulationResult,
    validateBalanceOrFee,
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
        feeInUsd: numberToString(getUsdFeeOfStep(s, tokens), null, 2),
        expectedOutputAmountHumanReadable: s.toAmount,
        outputAmount: '',
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

export const getUsdPrice = (
  blockchain: string,
  symbol: string,
  address: string | null,
  allTokens: Token[],
): number | null => {
  const token = allTokens?.find(
    (t) =>
      t.blockchain === blockchain &&
      t.symbol?.toUpperCase() === symbol?.toUpperCase() &&
      t.address === address,
  );
  return token?.usdPrice || null;
};

function getUsdFeeOfStep(step: SwapResult, allTokens: Token[]): BigNumber {
  let totalFeeInUsd = ZERO;
  for (let i = 0; i < step.fee.length; i++) {
    const fee = step.fee[i];
    if (fee.expenseType === 'DECREASE_FROM_OUTPUT') continue;

    const unitPrice = getUsdPrice(
      fee.asset.blockchain,
      fee.asset.symbol,
      fee.asset.address,
      allTokens,
    );
    totalFeeInUsd = totalFeeInUsd.plus(new BigNumber(fee.amount).multipliedBy(unitPrice || 0));
  }

  return totalFeeInUsd;
}

export function getTotalFeeInUsd(
  bestRoute: BestRouteResponse | null,
  allTokens: Token[],
): BigNumber | null {
  return (
    bestRoute?.result?.swaps.reduce(
      (totalFee: BigNumber, step) => totalFee.plus(getUsdFeeOfStep(step, allTokens)),
      ZERO,
    ) || null
  );
}

export function hasSlippageError(slippages: (RecommendedSlippage | null)[] | undefined) {
  return (slippages?.filter((s) => !!s?.error)?.length || 0) > 0;
}

export function getMinRequiredSlippage(slippages: (RecommendedSlippage | null)[] | undefined) {
  return (
    slippages
      ?.map((s) => s?.slippage || 0)
      ?.filter((s) => s > 0)
      ?.sort((a, b) => b - a)
      ?.find(() => true) || null
  );
}

export function hasProperSlippage(userSlippage: string, minRequiredSlippage: number | null) {
  return minRequiredSlippage !== null && parseFloat(userSlippage) > minRequiredSlippage;
}

export function hasEnoughBalance(route: BestRouteResponse, selectedWallets: SelectedWallet[]) {
  const fee = route.validationStatus;

  if (fee === null || fee.length === 0) return true;

  for (const wallet of selectedWallets) {
    const requiredAssets = getRequiredBalanceOfWallet(wallet, fee);
    if (!requiredAssets) continue;

    const enoughBalanceInWallet = requiredAssets
      .map((asset) => asset.ok)
      .reduce((previous, current) => previous && current);
    if (!enoughBalanceInWallet) return false;
  }

  return true;
}

export function hasEnoughBalanceAndProperSlippage(
  route: BestRouteResponse,
  selectedWallets: SelectedWallet[],
  userSlippage: string,
  minRequiredSlippage: number | null,
): boolean {
  return (
    hasEnoughBalance(route, selectedWallets) && hasProperSlippage(userSlippage, minRequiredSlippage)
  );
}

export function createBestRouteRequestBody(
  fromToken: Token,
  toToken: Token,
  inputAmount: string,
  wallets: Account[],
  selectedWallets: SelectedWallet[],
  disabledLiquiditySources: string[],
): BestRouteRequest {
  const selectedWalletsMap = selectedWallets.reduce(
    (selectedWalletsMap: BestRouteRequest['selectedWallets'], selectedWallet) => (
      (selectedWalletsMap[selectedWallet.chain] = selectedWallet.address), selectedWalletsMap
    ),
    {},
  );

  const connectedWallets: BestRouteRequest['connectedWallets'] = [];

  wallets.forEach((wallet) => {
    const chainAndAccounts = connectedWallets.find((connectedWallet) => connectedWallet.blockchain);
    if (!!chainAndAccounts) chainAndAccounts.addresses.push(wallet.address);
    else connectedWallets.push({ blockchain: wallet.chain, addresses: [wallet.address] });
  });

  const requestBody: BestRouteRequest = {
    amount: inputAmount.toString(),
    checkPrerequisites: true,
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
    selectedWallets: selectedWalletsMap,
    swapperGroups: disabledLiquiditySources,
    swappersGroupsExclude: true,
  };

  return requestBody;
}

export function getWalletsForNewSwap(selectedWallets: SelectedWallet[]) {
  const wallets = selectedWallets.reduce(
    (
      selectedWalletsMap: { [p: string]: { address: string; walletType: WalletType } },
      selectedWallet,
    ) => (
      (selectedWalletsMap[selectedWallet.chain] = {
        address: selectedWallet.address,
        walletType: selectedWallet.walletType,
      }),
      selectedWalletsMap
    ),
    {},
  );

  return wallets;
}

const getHelperTextAndComp = (w: SelectedWallet, fee: SimulationValidationStatus[] | null) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let HelperTextComp = Typography as any;
  let helperText = ;
  const requiredAssets = getRequiredBalanceOfWallet(w, fee);
  const result = [];
  if (fee) helperText = '';
  if (requiredAssets) {
    for (const asset of requiredAssets) {
      const symbol = asset.asset.symbol;
      const currentAmount = numberToString(
        new BigNumber(asset.currentAmount.amount).shiftedBy(-asset.currentAmount.decimals),
        8,
      );
      const requiredAmount = numberToString(
        new BigNumber(asset.requiredAmount.amount).shiftedBy(-asset.requiredAmount.decimals),
        8,
      );

      let reason = '';
      if (asset.reason === 'FEE') reason = ' for network fee';
      if (asset.reason === 'INPUT_ASSET') reason = ' for swap';
      if (asset.reason === 'FEE_AND_INPUT_ASSET') reason = ' for input and network fee';

      if (asset.ok) {
        helperText = `Needs ≈ ${requiredAmount} ${symbol}${reason}, and you have ${currentAmount} ${symbol}.`;
        HelperTextComp = SuccessTypo;
      } else {
        helperText = `Needs ≈ ${requiredAmount} ${symbol}${reason}, but you have ${currentAmount} ${symbol}.`;
        HelperTextComp = ErrorTypo;
      }
      result.push({ text: helperText, Component: HelperTextComp });
    }
  } else {
    result.push({ text: helperText, Component: HelperTextComp });
  }
  return result;
};
