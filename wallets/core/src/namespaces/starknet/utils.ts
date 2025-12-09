import type { ProviderAPI } from './types.js';
import type { CaipAccount } from '../../types/accounts.js';

import { AccountId } from 'caip';

import { LegacyNetworks } from '../../legacy/mod.js';

import { CAIP_NAMESPACE, CAIP_STARKNET_CHAIN_ID } from './constants.js';

export async function getAccounts(provider: ProviderAPI) {
  const starknetResponse = await provider.connect();
  /*
   * Fallback for wallets that return no response on connect.
   */
  const account = starknetResponse
    ? starknetResponse.publicKey.toString()
    : provider.publicKey.toString();
  return {
    accounts: [account],
    chainId: LegacyNetworks.SOLANA,
  };
}

export function formatAccountsToCAIP(accounts: string[]) {
  return accounts.map(
    (account) =>
      AccountId.format({
        address: account.toString(),
        chainId: {
          namespace: CAIP_NAMESPACE,
          reference: CAIP_STARKNET_CHAIN_ID,
        },
      }) as CaipAccount
  );
}
