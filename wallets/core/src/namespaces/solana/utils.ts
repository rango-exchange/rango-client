import type { ProviderAPI } from './types.js';

import { LegacyNetworks } from '../../legacy/mod.js';

export async function getAccounts(provider: ProviderAPI) {
  const solanaResponse = await provider.connect();
  /*
   * Fallback for wallets like Coinbase that return no response on connect.
   * If solanaResponse is undefined, use the provider's publicKey directly.
   */
  const account = solanaResponse
    ? solanaResponse.publicKey.toString()
    : provider.publicKey.toString();
  return {
    accounts: [account],
    chainId: LegacyNetworks.SOLANA,
  };
}
