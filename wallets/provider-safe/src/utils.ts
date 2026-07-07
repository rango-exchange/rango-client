import type { ChainId, ProviderAPI } from '@hub3js/evm';

import { getSafeProviderOrThrow } from './safe.ts';

export function evmSafe(): ProviderAPI {
  return getSafeProviderOrThrow() as ProviderAPI;
}

/*
 * Safe is a contract wallet embedded in an iframe: the account is already
 * available without a connection prompt, so we read it with `eth_accounts`
 * instead of the default `eth_requestAccounts` (which Safe's provider does not
 * implement).
 */
export async function getSafeAccounts(
  instance: ProviderAPI
): Promise<{ accounts: string[]; chainId: ChainId }> {
  const [accounts, chainId] = await Promise.all([
    instance.request({ method: 'eth_accounts' }),
    instance.request({ method: 'eth_chainId' }),
  ]);

  return { accounts, chainId };
}
