/** Poll interval (ms) while waiting for an approve transaction to confirm. */
export const INTERVAL_FOR_CHECK_APPROVE_TRANSACTION_STATUS = 5_000;

/**
 * How many times in a row the allowance has to read as sufficient before the
 * swap is allowed to run.
 *
 * A wallet's RPC endpoint is usually a load balancer over several nodes, so one
 * read can be answered by a node that has not applied the approve block yet.
 * A single read is therefore not evidence that the approval is effective, and
 * the swap that follows can go out against state where the allowance is still
 * missing and revert. Reading more than once, a block or two apart, has to
 * catch a node that lags.
 */
export const REQUIRED_ALLOWANCE_CONFIRMATIONS = 2;

/** Wait (ms) between the allowance reads that confirm each other. */
export const INTERVAL_BETWEEN_ALLOWANCE_CONFIRMATIONS = 3_000;

/**
 * How long (ms) to keep re-reading before a short allowance is reported as a
 * failure. A user who lowered the amount in their wallet is a real failure and
 * has to be told, but only once waiting can no longer explain the shortfall.
 */
export const TIMEOUT_FOR_ALLOWANCE_CONFIRMATIONS = 30_000;
