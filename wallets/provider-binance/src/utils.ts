import type { Provider } from './types.js';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { type ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';

export function binance(): Provider | null {
  const { binancew3w } = window;

  if (!binancew3w) {
    return null;
  }

  const instances = new Map();
  if (binancew3w.ethereum) {
    instances.set(LegacyNetworks.ETHEREUM, binancew3w.ethereum);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = binance();

  if (!instances) {
    throw new Error(
      'Binance Wallet is not injected. Please check your wallet.'
    );
  }

  return instances;
}

export function evmBinance(): EvmProviderApi {
  const instances = binance();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Binance not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}
/**
 * * WORKAROUND 1: Binance Wallet Race Condition
 * Simultaneous calls to 'eth_chainId' and 'eth_requestAccounts' fail to return
 * a chainId. These must be executed sequentially to ensure both values resolve.
 */
export async function getEvmAccounts(provider: EvmProviderApi) {
  /**
   * * WORKAROUND 2: Account Indexing Consistency
   * Binance Wallet's `connect` returns a list where the currently selected account
   * is always the first item. We're directly taking this first item as the active account.
   *
   */
  const [account] = await provider.request({
    method: 'eth_requestAccounts',
  });
  const chainId = await provider.request({ method: 'eth_chainId' });

  return {
    accounts: [account],
    chainId,
  };
}
