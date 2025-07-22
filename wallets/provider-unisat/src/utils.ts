import { LegacyNetworks } from '@arlert-dev/wallets-core/legacy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProviderAPI = Record<string, any>;
export type Provider = Map<string, unknown>;

export function unisat(): Provider | null {
  const { unisat } = window;

  if (!unisat) {
    return null;
  }

  const instances: Provider = new Map();

  if (unisat) {
    instances.set(LegacyNetworks.BTC, unisat);
  }

  return instances;
}

export function bitcoinUnisat(): ProviderAPI {
  const instances = unisat();
  const bitcoinInstance = instances?.get(LegacyNetworks.BTC);

  if (!bitcoinInstance) {
    throw new Error('UniSat not injected. Please check your wallet.');
  }

  return bitcoinInstance;
}
