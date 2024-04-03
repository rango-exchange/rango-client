import type { EvmNamespaceProvider } from '@rango-dev/wallets-core';
import type { Network } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

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

  return evmInstance as EvmNamespaceProvider;
}
