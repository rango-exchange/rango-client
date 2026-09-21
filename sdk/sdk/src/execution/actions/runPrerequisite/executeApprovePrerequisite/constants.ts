/**
 * How many reads in a row have to report a sufficient allowance before the
 * swap is allowed to run.
 *
 * A wallet's RPC endpoint is usually a load balancer over several nodes, so
 * one read can be answered by a node that has not applied the approve block
 * yet. Reading more than once, a block or two apart, has to catch a node that
 * lags.
 */
export const REQUIRED_ALLOWANCE_CONFIRMATIONS = 2;

/** Wait between the allowance reads that confirm each other, in milliseconds. */
export const INTERVAL_BETWEEN_ALLOWANCE_CONFIRMATIONS = 3_000;

/**
 * How long to keep re-reading before a short allowance counts as a failure,
 * in milliseconds. A user who lowered the amount in their wallet is a real
 * failure, but only once waiting can no longer explain the shortfall.
 */
export const TIMEOUT_FOR_ALLOWANCE_CONFIRMATIONS = 30_000;
