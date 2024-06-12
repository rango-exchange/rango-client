import type { Network } from '@rango-dev/wallets-core/legacy';
import type { ProviderApi } from '@rango-dev/wallets-core/namespaces/evm';

import { Networks } from '@rango-dev/wallets-core/legacy';

type Provider = Map<Network, any>;

export function phantom(): Provider | null {
  const { phantom } = window;

  if (!phantom) {
    return null;
  }

  const { solana, ethereum } = phantom;

  const instances: Provider = new Map();

  if (ethereum && ethereum.isPhantom) {
    instances.set(Networks.ETHEREUM, ethereum);
  }

  if (solana && solana.isPhantom) {
    instances.set(Networks.SOLANA, solana);
  }

  return instances;
}

export function evmPhantom() {
  const instances = phantom();

  const evmInstance = instances?.get(Networks.ETHEREUM);

  if (!instances || !evmInstance) {
    throw new Error(
      'Are you sure Phantom injected and you have enabled evm correctly?'
    );
  }

  return evmInstance as ProviderApi;
}

export function solanaPhantom() {
  const instance = phantom();
  const solanaInstance = instance?.get(Networks.SOLANA);

  if (!instance || !solanaInstance) {
    throw new Error(
      'Are you sure Phantom injected and you have enabled solana correctly?'
    );
  }

  return solanaInstance;
}

export const EVM_SUPPORTED_CHAINS = [Networks.ETHEREUM, Networks.POLYGON];
