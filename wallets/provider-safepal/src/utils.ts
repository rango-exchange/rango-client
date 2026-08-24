import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { InstanceMap } from '@hub3js/std/types';

import { EVM_NAMESPACE } from '@hub3js/namespaces';
import { isAddress as isEvmAddress } from 'ethers';

export type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
};
export type Provider = InstanceMap<ProviderObject>;
export function safepal(): Provider | null {
  const { safepalProvider: safePalEvm } = window;
  if (!safePalEvm) {
    return null;
  }
  const instances = new Map();
  if (safePalEvm) {
    instances.set(EVM_NAMESPACE, safePalEvm);
  }

  return instances;
}

export function evmSafepal(): EvmProviderApi {
  const instances = safepal();
  const evmInstance = instances?.get(EVM_NAMESPACE);
  if (!evmInstance) {
    throw new Error(
      'Safepal not injected or EVM not enabled. Please check your wallet.'
    );
  }
  return evmInstance;
}
export function getInstanceOrThrow(): Provider {
  const instances = safepal();

  if (!instances) {
    throw new Error('Trust Wallet is not injected. Please check your wallet.');
  }

  return instances;
}
/**
 * Return true if address is a valid EVM address.
 * Accepts:
 *  - all-lowercase or all-uppercase 0x-prefixed hex (non-checksummed - allowed)
 *  - checksummed (mixed-case according to EIP-55)
 */
export function isValidEvmAddress(address: string): boolean {
  // Pick wallet address.
  const walletAddress = address.split(':')[2];

  return isEvmAddress(walletAddress);
}
