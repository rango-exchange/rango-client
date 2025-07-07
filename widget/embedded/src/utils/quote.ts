/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { RetryQuote } from '../store/quote';
import type { FindToken } from '../store/slices/data';
import type { QuoteWarning, SelectedQuote, Wallet } from '../types';
import type {
  PriceImpactWarningLevel,
  SimulationAssetAndAmount,
  SimulationValidationStatus,
  Step,
} from '@rango-dev/ui';
import type {
  Asset,
  BlockchainMeta,
  MultiRouteResponse,
  MultiRouteSimulationResult,
  PreferenceType,
  RouteTag,
} from 'rango-sdk';
import type { PendingSwap } from 'rango-types';

import { getLastSuccessfulStep } from '@rango-dev/queue-manager-rango-preset';
import BigNumber from 'bignumber.js';

import { HIGH_PRIORITY_TAGS } from '../constants/quote';
import { HIGHT_PRICE_IMPACT, LOW_PRICE_IMPACT } from '../constants/routing';
import { HIGH_SLIPPAGE } from '../constants/swapSettings';
import { QuoteWarningType } from '../types';

import { areEqual } from './common';
import { createTokenHash, findBlockchain } from './meta';
import { numberToString } from './numbers';
import {
  checkSlippageWarnings,
  getMinRequiredSlippage,
  getPercentageChange,
  getTotalFeeInUsd,
  getUsdInputFrom,
  getUsdOutputFrom,
  hasHighValueLoss,
  hasProperSlippage,
  isOutputAmountChangedExcessively,
} from './swap';

export function isNumberOfSwapsChanged(
  quoteA: SelectedQuote,
  quoteB: SelectedQuote
) {
  const quoteASwaps = quoteA?.swaps || [];
  const quoteBSwaps = quoteB?.swaps || [];
  return quoteASwaps.length !== quoteBSwaps.length;
}

export function isQuoteSwappersUpdated(
  quoteA: SelectedQuote,
  quoteB: SelectedQuote
) {
  const quoteASwappers = quoteA?.swaps.map((swap) => swap.swapperId) || [];
  const quoteBSwappers = quoteB?.swaps.map((swap) => swap.swapperId) || [];
  return !areEqual(quoteASwappers, quoteBSwappers);
}

export function isQuoteInternalCoinsUpdated(
  quoteA: SelectedQuote,
  quoteB: SelectedQuote
) {
  const quoteAInternalCoins = quoteA?.swaps.map((swap) => swap.to.symbol) || [];
  const quoteBInternalCoins = quoteB?.swaps.map((swap) => swap.to.symbol) || [];
  return !areEqual(quoteAInternalCoins, quoteBInternalCoins);
}

export function isQuoteChanged(
  quoteA: SelectedQuote,
  quoteB: SelectedQuote
): boolean {
  return (
    isNumberOfSwapsChanged(quoteA, quoteB) ||
    isQuoteSwappersUpdated(quoteA, quoteB) ||
    isQuoteInternalCoinsUpdated(quoteA, quoteB)
  );
}

export function outToRatioHasWarning(
  fromUsdValue: BigNumber | null,
  outToInRatio: BigNumber | 0
) {
  return (
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -10 &&
      (fromUsdValue === null || fromUsdValue.gte(new BigNumber(200)))) ||
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -5 &&
      (fromUsdValue === null || fromUsdValue.gte(new BigNumber(1000))))
  );
}

export function getRequiredBalanceOfWallet(
  selectedWallet: Wallet,
  fee: SimulationValidationStatus[] | null
): SimulationAssetAndAmount[] | null {
  if (fee === null) {
    return null;
  }
  const relatedFeeStatus = fee
    ?.find((item) => item.blockchain === selectedWallet.chain)
    ?.wallets.find(
      (wallet) =>
        wallet.address?.toLowerCase() === selectedWallet.address.toLowerCase()
    );
  if (!relatedFeeStatus) {
    return null;
  }
  return relatedFeeStatus.requiredAssets;
}

export function getPriceImpactLevel(
  priceImpact: number
): PriceImpactWarningLevel {
  let warningLevel: PriceImpactWarningLevel = undefined;
  if (priceImpact <= LOW_PRICE_IMPACT && priceImpact > HIGHT_PRICE_IMPACT) {
    warningLevel = 'low';
  } else if (priceImpact <= HIGHT_PRICE_IMPACT) {
    warningLevel = 'high';
  }

  return warningLevel;
}

export function findCommonTokens<T extends Asset[], R extends Asset[]>(
  listA: T,
  listB: R
) {
  const set = new Set();

  listA.forEach((token) => set.add(createTokenHash(token)));

  return listB.filter((token) => set.has(createTokenHash(token))) as R;
}

export function createRetryQuote(
  pendingSwap: PendingSwap,
  blockchains: BlockchainMeta[],
  findToken: FindToken
): RetryQuote {
  const firstStep = pendingSwap.steps[0];
  const lastStep = pendingSwap.steps[pendingSwap.steps.length - 1];
  const lastSuccessfulStep = getLastSuccessfulStep(pendingSwap.steps);

  if (!lastStep || !firstStep) {
    return {
      fromBlockchain: null,
      fromToken: undefined,
      toBlockchain: null,
      toToken: undefined,
      inputAmount: '',
    };
  }

  const toToken = {
    blockchain: lastStep.toBlockchain,
    symbol: lastStep.toSymbol,
    address: lastStep.toSymbolAddress,
  };

  const fromBlockchainMeta = findBlockchain(
    lastSuccessfulStep
      ? lastSuccessfulStep.toBlockchain
      : firstStep.fromBlockchain,
    blockchains
  );
  const toBlockchainMeta = findBlockchain(lastStep.toBlockchain, blockchains);
  const fromTokenMeta = findToken(
    lastSuccessfulStep
      ? {
          blockchain: fromBlockchainMeta?.name ?? '',
          symbol: lastSuccessfulStep.toSymbol,
          address: lastSuccessfulStep.toSymbolAddress,
        }
      : {
          blockchain: fromBlockchainMeta?.name ?? '',
          symbol: firstStep.fromSymbol,
          address: firstStep.fromSymbolAddress,
        }
  );
  const toTokenMeta = findToken(toToken);
  const inputAmount = lastSuccessfulStep
    ? lastSuccessfulStep.outputAmount ?? ''
    : pendingSwap.inputAmount;

  return {
    fromBlockchain: fromBlockchainMeta,
    fromToken: fromTokenMeta,
    toBlockchain: toBlockchainMeta,
    toToken: toTokenMeta,
    inputAmount,
  };
}

export function generateQuoteWarnings(params: {
  previousQuote?: SelectedQuote;
  currentQuote: SelectedQuote;
  findToken: FindToken;
  userSlippage: number;
}): QuoteWarning | null {
  const { previousQuote, currentQuote, findToken, userSlippage } = params;
  const usdInput = getUsdInputFrom(currentQuote);
  const usdOutput = getUsdOutputFrom(currentQuote);

  if (!!currentQuote && usdInput && usdOutput) {
    const priceImpact = getPriceImpact(
      usdInput.toString(),
      usdOutput.toString()
    );
    const highValueLoss =
      !!priceImpact && hasHighValueLoss(usdInput, priceImpact);

    if (highValueLoss) {
      const totalFee = getTotalFeeInUsd(currentQuote?.swaps, findToken);
      const warningLevel = getPriceImpactLevel(priceImpact);
      return {
        type: QuoteWarningType.HIGH_VALUE_LOSS,
        inputUsdValue: usdInput,
        outputUsdValue: usdOutput,
        priceImpact,
        totalFee,
        warningLevel,
      };
    }
  }

  if (
    previousQuote &&
    isOutputAmountChangedExcessively(previousQuote, currentQuote)
  ) {
    return {
      type: QuoteWarningType.EXCESSIVE_OUTPUT_AMOUNT_CHANGE,
      usdValueChange: numberToString(
        getUsdOutputFrom(currentQuote)
          ?.minus(getUsdOutputFrom(previousQuote) ?? 0)
          .toString() ?? '0',
        null,
        2
      ),
      percentageChange: numberToString(
        getPriceImpact(
          getUsdOutputFrom(previousQuote) ?? '1',
          getUsdOutputFrom(currentQuote) ?? '1'
        ),
        null,
        2
      ),
    };
  }

  if (currentQuote && (!usdInput || !usdOutput)) {
    return { type: QuoteWarningType.UNKNOWN_PRICE };
  }

  const minRequiredSlippage = getMinRequiredSlippage(currentQuote.swaps);
  const highSlippage = userSlippage > HIGH_SLIPPAGE;

  if (!hasProperSlippage(params.userSlippage.toString(), minRequiredSlippage)) {
    return {
      type: QuoteWarningType.INSUFFICIENT_SLIPPAGE,
      recommendedSlippages: checkSlippageWarnings(currentQuote, userSlippage),
      minRequiredSlippage: minRequiredSlippage,
    };
  } else if (
    highSlippage &&
    parseFloat(minRequiredSlippage ?? '0') < userSlippage
  ) {
    return {
      type: QuoteWarningType.HIGH_SLIPPAGE,
      slippage: userSlippage.toString(),
    };
  }

  return null;
}

export function isQuoteWarningConfirmationRequired(warning: QuoteWarning) {
  const WARNINGS_NOT_REQUIRING_CONFIRMATION = [
    QuoteWarningType.EXCESSIVE_OUTPUT_AMOUNT_CHANGE,
  ];
  return !WARNINGS_NOT_REQUIRING_CONFIRMATION.includes(warning.type);
}

export function getPriceImpact(
  inputUsdValue: BigNumber | string | null,
  outputUsdValue: BigNumber | string | null
): number | null {
  const outputUsdValueIsInvalid =
    typeof outputUsdValue === 'string'
      ? parseFloat(outputUsdValue) <= 0
      : !outputUsdValue?.gt(0);
  const percentageChange =
    !inputUsdValue || !outputUsdValue || outputUsdValueIsInvalid
      ? null
      : getPercentageChange(
          inputUsdValue.toString(),
          outputUsdValue.toString()
        );

  return percentageChange && percentageChange < 0 ? percentageChange : null;
}

export const getUniqueBlockchains = (steps: Step[]) => {
  const set = new Set();
  const result: { displayName: string; image?: string }[] = [];
  steps.forEach((step) => {
    if (!set.has(step.from.chain.displayName)) {
      set.add(step.from.chain.displayName);
      result.push(step.from.chain);
    }
    if (!set.has(step.to.chain.displayName)) {
      set.add(step.to.chain.displayName);
      result.push(step.to.chain);
    }
  });

  return result;
};

export const sortQuotesBy = (
  strategy: PreferenceType,
  quotes: MultiRouteResponse['results']
): MultiRouteResponse['results'] => {
  return quotes.sort((quote1, quote2) => {
    const getScore = (route: MultiRouteSimulationResult) =>
      route.scores?.find((score) => score.preferenceType === strategy)?.score ??
      0;

    const quote1Score = getScore(quote1);
    const quote2Score = getScore(quote2);

    if (quote1Score !== quote2Score) {
      return quote2Score - quote1Score;
    }

    const lowerQuoteId1 = quote1.requestId.toLowerCase();
    const lowerQuoteId2 = quote2.requestId.toLowerCase();

    return lowerQuoteId1.localeCompare(lowerQuoteId2);
  });
};

export const getDefaultQuote = (
  currentQuote: SelectedQuote | null,
  quotes: MultiRouteSimulationResult[],
  requestAmount: string
): SelectedQuote | null => {
  const quote = quotes[0]; // Return the first quote from the quotes array
  if (!quotes.length || !quote) {
    return null;
  }
  if (!currentQuote) {
    // Handle the case where currentQuote is null
    return {
      requestAmount,
      validationStatus: null,
      ...quote,
    };
  }
  // Create a set of swapperIds from the currentQuote swaps
  const currentQuoteSwapperIds = new Set(
    currentQuote.swaps.map((swap) => swap.swapperId)
  );

  // Find a quote that matches the currentQuote's swapperIds
  const matchedQuote = quotes.find((quote) => {
    // Create a set of swapperIds from the quote swaps
    const quoteSwapperIds = new Set(quote.swaps.map((swap) => swap.swapperId));

    // Check if all swapperIds from the currentQuote are present in the quoteSwapperIds
    return Array.from(currentQuoteSwapperIds).every((swapperId) =>
      quoteSwapperIds.has(swapperId)
    );
  });

  // Return the matchedQuote if found, otherwise return the first quote from the quotes array
  return {
    requestAmount,
    validationStatus: null,
    ...(matchedQuote || quote),
  };
};

export const sortTags = (tags: RouteTag[]): RouteTag[] => {
  const customSort = (a: RouteTag, b: RouteTag) => {
    const indexA = HIGH_PRIORITY_TAGS.indexOf(a.value);
    const indexB = HIGH_PRIORITY_TAGS.indexOf(b.value);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) {
      return -1;
    } else if (indexB !== -1) {
      return 1;
    }

    return 0;
  };

  return tags.sort(customSort);
};
