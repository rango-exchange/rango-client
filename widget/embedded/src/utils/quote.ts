/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { QuoteError, QuoteWarning, Wallet } from '../types';
import type { PriceImpactWarningLevel, Step } from '@rango-dev/ui';
import type {
  SimulationAssetAndAmount,
  SimulationValidationStatus,
} from '@rango-dev/ui/dist/widget/ui/src/types/swaps';
import type {
  Asset,
  BestRouteResponse,
  BlockchainMeta,
  Token,
} from 'rango-sdk';
import type { PendingSwap } from 'rango-types';

import { getLastSuccessfulStep } from '@rango-dev/queue-manager-rango-preset';
import BigNumber from 'bignumber.js';

import { HIGHT_PRICE_IMPACT, LOW_PRICE_IMPACT } from '../constants/routing';
import { HIGH_SLIPPAGE } from '../constants/swapSettings';
import { getUsdValue } from '../store/quote';
import { QuoteErrorType, QuoteWarningType } from '../types';

import { areEqual } from './common';
import { findBlockchain, findToken } from './meta';
import {
  checkSlippageErrors,
  checkSlippageWarnings,
  getLimitErrorMessage,
  getMinRequiredSlippage,
  getPercentageChange,
  getTotalFeeInUsd,
  hasHighValueLoss,
  hasLimitError,
  hasProperSlippage,
} from './swap';

export function searchParamsToToken(
  tokens: Token[],
  searchParams: string | null,
  chain: BlockchainMeta | null
): Token | null {
  if (!chain) {
    return null;
  }
  return (
    tokens.find((token) => {
      const symbolAndAddress = searchParams?.split('--');
      if (symbolAndAddress?.length === 1) {
        return (
          token.symbol === symbolAndAddress[0] &&
          token.address === null &&
          token.blockchain === chain.name
        );
      }
      return (
        token.symbol === symbolAndAddress?.[0] &&
        token.address === symbolAndAddress?.[1] &&
        token.blockchain === chain.name
      );
    }) || null
  );
}

export function getQuoteToTokenUsdPrice(
  quote: BestRouteResponse | null
): number | null | undefined {
  return quote?.result?.swaps[quote?.result?.swaps.length - 1].to.usdPrice;
}

export function isNumberOfSwapsChanged(
  quoteA: BestRouteResponse,
  quoteB: BestRouteResponse
) {
  const quoteASwaps = quoteA.result?.swaps || [];
  const quoteBSwaps = quoteB.result?.swaps || [];
  return quoteASwaps.length !== quoteBSwaps.length;
}

export function isQuoteSwappersUpdated(
  quoteA: BestRouteResponse,
  quoteB: BestRouteResponse
) {
  const quoteASwappers =
    quoteA.result?.swaps.map((swap) => swap.swapperId) || [];
  const quoteBSwappers =
    quoteB.result?.swaps.map((swap) => swap.swapperId) || [];
  return !areEqual(quoteASwappers, quoteBSwappers);
}

export function isQuoteInternalCoinsUpdated(
  quoteA: BestRouteResponse,
  quoteB: BestRouteResponse
) {
  const quoteAInternalCoins =
    quoteA.result?.swaps.map((swap) => swap.to.symbol) || [];
  const quoteBInternalCoins =
    quoteB.result?.swaps.map((swap) => swap.to.symbol) || [];
  return !areEqual(quoteAInternalCoins, quoteBInternalCoins);
}

export function isQuoteChanged(
  quoteA: BestRouteResponse,
  quoteB: BestRouteResponse
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
  const tokenToString = (token: Asset): string =>
    `${token.symbol}-${token.blockchain}-${token.address ?? ''}`;

  const set = new Set();

  listA.forEach((token) => set.add(tokenToString(token)));

  return listB.filter((token) => set.has(tokenToString(token))) as R;
}

export function createRetryQuote(
  pendingSwap: PendingSwap,
  blockchains: BlockchainMeta[],
  tokens: Token[]
): {
  fromBlockchain: BlockchainMeta | null;
  fromToken: Token | null;
  toBlockchain: BlockchainMeta | null;
  toToken: Token | null;
  inputAmount: string;
} {
  const firstStep = pendingSwap.steps[0];
  const lastStep = pendingSwap.steps[pendingSwap.steps.length - 1];
  const lastSuccessfulStep = getLastSuccessfulStep(pendingSwap.steps);

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
        },
    tokens
  );
  const toTokenMeta = findToken(toToken, tokens);
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

export function generateQuoteWarnings(
  quote: BestRouteResponse,
  params: {
    fromToken: Token;
    toToken: Token;
    tokens: Token[];
    userSlippage: number;
  }
): QuoteWarning | null {
  const { fromToken, toToken, tokens, userSlippage } = params;
  const inputUsdValue = getUsdValue(fromToken, quote.requestAmount);
  const outputUsdValue = getUsdValue(toToken, quote.result?.outputAmount ?? '');

  if (quote.result && inputUsdValue && outputUsdValue) {
    const priceImpact = getPriceImpact(
      inputUsdValue.toString(),
      outputUsdValue.toString()
    );
    const highValueLoss =
      !!priceImpact && hasHighValueLoss(inputUsdValue, priceImpact);

    if (highValueLoss) {
      const totalFee = getTotalFeeInUsd(quote.result.swaps, tokens);
      const warningLevel = getPriceImpactLevel(priceImpact);
      return {
        type: QuoteWarningType.HIGH_VALUE_LOSS,
        inputUsdValue,
        outputUsdValue,
        priceImpact,
        totalFee,
        warningLevel,
      };
    }
  } else if (quote.result && (!inputUsdValue || !outputUsdValue)) {
    return { type: QuoteWarningType.UNKNOWN_PRICE };
  }

  const minRequiredSlippage = getMinRequiredSlippage(quote);
  const highSlippage = userSlippage > HIGH_SLIPPAGE;

  if (!hasProperSlippage(params.userSlippage.toString(), minRequiredSlippage)) {
    return {
      type: QuoteWarningType.INSUFFICIENT_SLIPPAGE,
      recommendedSlippages: checkSlippageWarnings(quote, userSlippage),
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

export function generateQuoteErrors(
  quote: BestRouteResponse
): QuoteError | null {
  if (!quote.result) {
    return {
      type: QuoteErrorType.NO_RESULT,
      diagnosisMessage: quote.diagnosisMessages?.[0],
    };
  }
  const limitError = hasLimitError(quote);
  if (limitError) {
    const { swap, recommendation, fromAmountRangeError } =
      getLimitErrorMessage(quote);
    return {
      type: QuoteErrorType.BRIDGE_LIMIT,
      swap: swap,
      recommendation,
      fromAmountRangeError,
    };
  }

  const recommendedSlippages = checkSlippageErrors(quote);

  if (recommendedSlippages) {
    const minRequiredSlippage = getMinRequiredSlippage(quote);
    return {
      type: QuoteErrorType.INSUFFICIENT_SLIPPAGE,
      recommendedSlippages,
      minRequiredSlippage,
    };
  }

  return null;
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
  const result: { displayName: string; image: string }[] = [];
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
