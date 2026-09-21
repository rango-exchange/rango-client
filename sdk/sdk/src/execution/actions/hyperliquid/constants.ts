/** Where a signed user action is submitted. */
export const HYPERLIQUID_EXCHANGE_API_URL =
  'https://api.hyperliquid.xyz/exchange';

/** Where a submitted action is looked up afterwards, since submitting returns no hash. */
export const HYPERLIQUID_EXPLORER_API_URL =
  'https://rpc.hyperliquid.xyz/explorer';

/** The user-signed actions the API builds for a swap. */
export const HYPERLIQUID_SUPPORTED_ACTIONS = ['withdraw3', 'usdSend'];
