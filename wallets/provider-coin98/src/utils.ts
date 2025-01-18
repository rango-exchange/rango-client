import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { Networks } from '@rango-dev/wallets-shared';

export function coin98() {
  const { coin98, ethereum } = window;

  if (!coin98) {
    return null;
  }

  const instances = new Map();

  // When disabled overring metamask
  if (coin98.provider) {
    instances.set(Networks.ETHEREUM, coin98.provider);
  }
  if (ethereum && ethereum.isCoin98) {
    instances.set(Networks.ETHEREUM, ethereum);
  }
  if (coin98.sol) {
    instances.set(Networks.SOLANA, coin98.sol);
  }

  return instances;
}

/*
 *This is how coin98 is getting solana accounts.
 *That's the reason we haven't moved it to `shared`
 */
export async function getSolanaAccounts(instance: any) {
  await instance.enable();
  const accounts = await instance.request({ method: 'sol_accounts' });
  return {
    accounts,
  };
}

export function solanaCoin98(): SolanaProviderApi {
  const instance = coin98();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'Coin98 not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}

export function evmCoin98(): EvmProviderApi {
  const instances = coin98();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Coin98 not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}
