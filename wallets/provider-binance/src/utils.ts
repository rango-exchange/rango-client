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
      'Rabby not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}
export async function getEvmAccounts(provider: EvmProviderApi) {
  /*
   * Binance Wallet bug: sending eth_chainId + eth_requestAccounts together returns empty chainId.
   * Must request them serially (chainId after accounts) to work correctly.
   */
  const accounts = await provider.request({
    method: 'eth_requestAccounts',
  });
  const chainId = await provider.request({ method: 'eth_chainId' });

  return {
    accounts,
    chainId,
  };
}
