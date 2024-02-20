/* eslint-disable @typescript-eslint/prefer-enum-initializers */

import type { PriceImpactWarningLevel } from '@rango-dev/ui';
import type BigNumber from 'bignumber.js';
import type {
  BlockchainValidationStatus,
  RouteTag,
  RoutingResultType,
  SwapResult,
} from 'rango-sdk';

export enum QuoteErrorType {
  NO_RESULT,
  REQUEST_FAILED,
  REQUEST_CANCELED,
  BRIDGE_LIMIT,
  INSUFFICIENT_SLIPPAGE,
}

export type NoResultError = {
  type: QuoteErrorType.NO_RESULT;
  diagnosisMessage?: string;
};

export type BridgeLimitError = {
  type: QuoteErrorType.BRIDGE_LIMIT;
  swap: SwapResult;
  recommendation: string;
  fromAmountRangeError: string;
};

export type InsufficientSlippageError = {
  type: QuoteErrorType.INSUFFICIENT_SLIPPAGE;
  recommendedSlippages: RecommendedSlippages | null;
  minRequiredSlippage: string | null;
};

export type QuoteRequestFailed = { type: QuoteErrorType.REQUEST_FAILED };
export type QuoteRequestCanceled = { type: QuoteErrorType.REQUEST_CANCELED };

export type QuoteError =
  | NoResultError
  | BridgeLimitError
  | InsufficientSlippageError
  | QuoteRequestFailed
  | QuoteRequestCanceled;

export enum QuoteWarningType {
  HIGH_VALUE_LOSS,
  UNKNOWN_PRICE,
  INSUFFICIENT_SLIPPAGE,
  HIGH_SLIPPAGE,
}

export enum QuoteUpdateType {
  QUOTE_UPDATED,
  QUOTE_SWAPPERS_UPDATED,
  QUOTE_COINS_UPDATED,
  QUOTE_AND_OUTPUT_AMOUNT_UPDATED,
  QUOTE_UPDATED_WITH_HIGH_VALUE_LOSS,
}

export type QuoteUpdateWarning =
  | {
      type: QuoteUpdateType.QUOTE_AND_OUTPUT_AMOUNT_UPDATED;
      newOutputAmount: string;
      percentageChange: string;
    }
  | {
      type: Exclude<
        QuoteUpdateType,
        QuoteUpdateType.QUOTE_AND_OUTPUT_AMOUNT_UPDATED
      >;
    };

export type RecommendedSlippages = Map<number, string>;

export type InsufficientSlippageWarning = {
  type: QuoteWarningType.INSUFFICIENT_SLIPPAGE;
  recommendedSlippages: RecommendedSlippages | null;
  minRequiredSlippage: string | null;
};

export type HighSlippageWarning = {
  type: QuoteWarningType.HIGH_SLIPPAGE;
  slippage: string | null;
};

export type HighValueLossWarning = {
  type: QuoteWarningType.HIGH_VALUE_LOSS;
  warningLevel: PriceImpactWarningLevel;
  inputUsdValue: BigNumber;
  outputUsdValue: BigNumber;
  totalFee: BigNumber;
  priceImpact: number;
};

export type UnknownPriceWarning = {
  type: QuoteWarningType.UNKNOWN_PRICE;
};

export type QuoteWarning =
  | HighValueLossWarning
  | InsufficientSlippageWarning
  | HighSlippageWarning
  | UnknownPriceWarning;

export type ConfirmSwapWarnings = {
  quote: QuoteWarning | null;
  quoteUpdate: QuoteUpdateWarning | null;
  balance: { messages: string[] } | null;
};

export type QuoteResponse = {
  requestId: string;
  swaps?: SwapResult[];
  diagnosisMessages: string[] | null;
};

export type SelectedQuote = {
  swaps: SwapResult[];
  requestId: string;
  outputAmount?: string;
  resultType?: RoutingResultType;
  tags?: RouteTag[];
  validationStatus: BlockchainValidationStatus[] | null;
  requestAmount: string;
};

export type QuoteErrorResponse = {
  message: string;
  options: QuoteError;
};
