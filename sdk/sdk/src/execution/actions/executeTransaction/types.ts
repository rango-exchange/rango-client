/**
 * What the engine hooks into an executor. `beforeSign` runs once the wallet
 * is known to be ready and immediately before it is asked to sign, so the
 * engine can lift a block and put `sign_requested` on record at exactly that
 * point and not a moment earlier: a reload during the guard or a network
 * switch must not look like an interrupted signing.
 */
export type ExecuteHooks = {
  beforeSign?: () => Promise<void>;
};

/**
 * What an executor comes back with once the wallet has done its part: the
 * transaction's hash, or `null` when the transaction is out but its hash has
 * to be looked up afterwards, as on Hyperliquid.
 */
export type SendResult = {
  hash: string | null;
};
