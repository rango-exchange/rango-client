import type { ProviderApi as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderApi as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

import { Networks } from '@rango-dev/wallets-core/legacy';

type Provider = Map<string, unknown>;

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

export function evmPhantom(): EvmProviderApi {
  const instances = phantom();

  const evmInstance = instances?.get(Networks.ETHEREUM);

  if (!instances || !evmInstance) {
    throw new Error(
      'Are you sure Phantom injected and you have enabled EVM correctly?'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaPhantom(): SolanaProviderApi {
  const instance = phantom();
  const solanaInstance = instance?.get(Networks.SOLANA);

  if (!instance || !solanaInstance) {
    throw new Error(
      'Are you sure Phantom injected and you have enabled Solana correctly?'
    );
  }

  return solanaInstance;
}
