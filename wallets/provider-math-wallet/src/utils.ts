import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';

import { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';

export function mathWallet(): Provider | null {
  const { solana, ethereum } = window;
  const instances: Provider = new Map();
  if (ethereum && ethereum.isMathWallet) {
    instances.set(EVM_NAMESPACE, ethereum);
  }
  if (solana && solana.isMathWallet) {
    instances.set(SOLANA_NAMESPACE, solana);
  }
  if (instances.size === 0) {
    return null;
  }
  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = mathWallet();

  if (!instances) {
    throw new Error('Math Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmMathWallet(): EvmProviderApi {
  const instances = mathWallet();

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'Math Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}

export function solanaMathWallet(): SolanaProviderApi {
  const instance = mathWallet();
  const solanaInstance = instance?.get(SOLANA_NAMESPACE);

  if (!solanaInstance) {
    throw new Error(
      'Math Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}
