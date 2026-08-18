import { UTXO_NAMESPACE } from '@hub3js/namespaces';

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
    instances.set(UTXO_NAMESPACE, unisat);
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = unisat();

  if (!instances) {
    throw new Error('Unisat is not injected. Please check your wallet.');
  }

  return instances;
}

export function bitcoinUnisat(): ProviderAPI {
  const instances = unisat();
  const bitcoinInstance = instances?.get(UTXO_NAMESPACE);

  if (!bitcoinInstance) {
    throw new Error('UniSat not injected. Please check your wallet.');
  }

  return bitcoinInstance;
}
