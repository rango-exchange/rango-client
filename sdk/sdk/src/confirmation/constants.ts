/**
 * The thresholds the widget warns at, so a host that moves to the SDK keeps
 * seeing the same warnings.
 */

export const PERCENT_MULTIPLIER = 100;

/** A warning fires when the change is at or below `threshold` percent and the input is worth at least `minInput` USD. */
export type WarningCriterion = { threshold: number; minInput: number };

export const HIGH_VALUE_LOSS_CRITERIA: WarningCriterion[] = [
  { threshold: -10, minInput: 400 },
  { threshold: -5, minInput: 1000 },
];

export const OUTPUT_CHANGE_CRITERIA: WarningCriterion[] = [
  { threshold: -1, minInput: 1000 },
  { threshold: -2, minInput: 500 },
];

/** A price impact at or below this, in percent, is a `high` value loss; any other high value loss is `low`. */
export const HIGH_PRICE_IMPACT = -10;

/** A slippage above this, in percent, gets a warning. */
export const HIGH_SLIPPAGE = 5;

/** How long to wait before retrying a failed confirm call. */
export const CONFIRM_RETRY_DELAY_MS = 2_000;
