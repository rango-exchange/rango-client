import type { ProviderAPI } from './types.js';

import { LegacyNetworks } from '../../legacy/mod.js';

export async function getAccounts(provider: ProviderAPI) {
  const solanaResponse = await provider.connect();
  const account = solanaResponse.publicKey.toString();
  return {
    accounts: [account],
    chainId: LegacyNetworks.SOLANA,
  };
}
