import type { WalletConnectionSource } from '../types';

/**
 * Tracks where the user started a wallet connection inside the widget (the swap
 * button, the nav, or the confirm-wallets modal) so the `walletConnected` event
 * can carry a `source`.
 *
 * The initiation and the resulting connection are far apart (the user still has
 * to pick a wallet and approve a popup), so the source is stashed when the flow
 * is initiated and consumed by the next connection that completes:
 *
 *   1. connection initiated -> setPendingWalletConnectionSource(source)
 *   2. a wallet connects     -> newWalletConnected reads consumeWalletConnectionSource()
 */
let pendingSource: WalletConnectionSource | null = null;

/** Records the source for the connection the user is about to start. */
export function setPendingWalletConnectionSource(
  source: WalletConnectionSource | null
): void {
  pendingSource = source;
}

/**
 * Returns the pending source and clears it, so it's applied to exactly one
 * connection and can't leak to later, unrelated ones.
 */
export function consumeWalletConnectionSource(): WalletConnectionSource | null {
  const source = pendingSource;
  pendingSource = null;
  return source;
}
