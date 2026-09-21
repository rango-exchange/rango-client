import type { RangoSdkError } from '../errors.js';
import type { SwapExecution } from '../execution/types.ts';
import type {
  AmountRestrictionType,
  ConfirmRouteResponse,
  MultiRouteSimulationResult,
  WalletRequiredAssets,
} from 'rango-sdk';
import type { SwapSavedSettings } from 'rango-types';

export type ConfirmedRoute = NonNullable<ConfirmRouteResponse['result']>;

/**
 * The quote the user picked, as `quotes` returns it. A quote from the single
 * `quote` call is passed as `{ requestId, ...result }`.
 */
export type SelectedQuote = Pick<
  MultiRouteSimulationResult,
  'requestId' | 'outputAmount' | 'swaps'
>;

/** A wallet the user picked for one of the chains the route touches. */
export type SelectedWallet = {
  chain: string;
  address: string;
  walletType: string;
  derivationPath?: string;
};

export type ConfirmQuoteParams = {
  quote: SelectedQuote;
  /**
   * One wallet per chain the route touches. With a `destination` the chain the
   * route ends on needs no wallet, since the output goes to that address.
   */
  selectedWallets: SelectedWallet[];
  /** A custom address to receive the output, if not the destination wallet. */
  destination?: string;
  settings: SwapSavedSettings;
  swapMode?: 'swap' | 'refuel';
};

/**
 * Why `confirm` could not produce an execution. It is the `cause` of the error
 * `confirm` returns, and holds data only, so the host owns the wording.
 */
export type ConfirmQuoteIssue =
  /** The host aborted the request through `RequestOptions.signal`. */
  | { type: 'request_canceled' }
  /** The confirm call failed, or the API answered with an error. */
  | {
      type: 'request_failed';
      /** The API's error text, or the failure's message. */
      detail: string | null;
    }
  /** A chain the route touches has no selected wallet. Checked before the call. */
  | { type: 'missing_wallets'; chains: string[] }
  | {
      type: 'no_result';
      /** The API's best guess at why no route was found. */
      diagnosisMessage: string | null;
    }
  | {
      type: 'amount_out_of_range';
      /** The first step whose input amount is outside its range. */
      stepIndex: number;
      amount: string;
      min: string | null;
      max: string | null;
      restrictionType: AmountRestrictionType;
    }
  | {
      type: 'insufficient_slippage';
      /** The slippage each step that rejected the user's one recommends, by step index. */
      recommendedSlippages: Record<number, string>;
      /** The lowest slippage that satisfies every step. */
      minRequiredSlippage: string | null;
    };

/** An asset a selected wallet holds less of than the route needs. */
export type BalanceShortfall = WalletRequiredAssets & {
  chain: string;
  address: string;
};

export type PriceImpactLevel = 'low' | 'high';

/** The output is worth notably less than the input. */
export type HighValueLossWarning = {
  /** The change from input to output value, in percent. Always negative. */
  priceImpact: number;
  level: PriceImpactLevel;
  inputUsd: string;
  outputUsd: string;
  /** The fees paid from the wallet, priced by the API. */
  totalFeeUsd: string;
};

/** The confirmed output is worth notably less than the picked quote promised. */
export type OutputChangeWarning = {
  /** The change from the picked quote's output value, in percent. Always negative. */
  percentageChange: number;
  /** The confirmed output value minus the picked quote's, in USD. Always negative. */
  usdChange: string;
};

/** A token has no USD price, so value loss cannot be judged. */
export type UnknownPriceWarning = {
  input: boolean;
  output: boolean;
};

/** The user's slippage is below what a step recommends. */
export type InsufficientSlippageWarning = {
  /** The slippage each step recommends above the user's one, by step index. */
  recommendedSlippages: Record<number, string>;
  /** The lowest slippage that satisfies every step. */
  minRequiredSlippage: string;
};

/** The user's slippage is high enough to allow a poor fill. */
export type HighSlippageWarning = {
  slippage: string;
};

/** A selected wallet is short of an asset the route needs. */
export type BalanceWarning = {
  shortfalls: BalanceShortfall[];
};

/**
 * What the user should see before starting the swap. Every check runs on its
 * own, so more than one key can be set. Each key is `null` when there is
 * nothing to warn about, and none of them stop the swap from running.
 */
export type ConfirmQuoteWarnings = {
  highValueLoss: HighValueLossWarning | null;
  outputChange: OutputChangeWarning | null;
  unknownPrice: UnknownPriceWarning | null;
  insufficientSlippage: InsufficientSlippageWarning | null;
  highSlippage: HighSlippageWarning | null;
  /**
   * The swap can still be started, but the engine won't re-check balances
   * before running it.
   */
  balance: BalanceWarning | null;
};

export type ConfirmQuoteResult =
  | {
      ok: true;
      route: ConfirmedRoute;
      execution: SwapExecution;
      warnings: ConfirmQuoteWarnings;
    }
  | { ok: false; error: RangoSdkError };
