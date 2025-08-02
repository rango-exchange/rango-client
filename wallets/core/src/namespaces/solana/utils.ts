import type { ProviderAPI } from './types.js';
import type { CaipAccount } from '../common/mod.js';

import { AccountId } from 'caip';

import { LegacyNetworks } from '../../legacy/mod.js';

import { CAIP_NAMESPACE, CAIP_SOLANA_CHAIN_ID } from './constants.js';

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

export function formatAccountsToCaipAccounts(
  accounts: Awaited<ReturnType<typeof getAccounts>>['accounts']
): CaipAccount[] {
  return accounts.map(
    (account) =>
      AccountId.format({
        address: account,
        chainId: {
          namespace: CAIP_NAMESPACE,
          reference: CAIP_SOLANA_CHAIN_ID,
        },
      }) as CaipAccount
  );
}
