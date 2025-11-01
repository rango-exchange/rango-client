import type { Provider, XVerseResponse } from './types.js';
import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/utxo';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function xverse(): Provider | null {
  const { XverseProviders } = window;

  if (!XverseProviders) {
    return null;
  }

  const instances: Provider = new Map();

  if (XverseProviders.BitcoinProvider) {
    instances.set(LegacyNetworks.BTC, XverseProviders.BitcoinProvider);
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = xverse();

  if (!instances) {
    throw new Error('Xverse is not injected. Please check your wallet.');
  }

  return instances;
}

export function bitcoinXverse(): ProviderAPI {
  const instances = xverse();
  const bitcoinInstance = instances?.get(LegacyNetworks.BTC);

  if (!bitcoinInstance) {
    throw new Error('Xverse not injected. Please check your wallet.');
  }

  return bitcoinInstance;
}
export async function getBitcoinAccounts(): Promise<XVerseResponse> {
  const instance = bitcoinXverse();
  const requestResult = await instance.request('wallet_connect', {
    addresses: ['payment'],
  });

  if (requestResult.error?.message) {
    throw new Error(requestResult.error.message);
  }

  return requestResult;
}
