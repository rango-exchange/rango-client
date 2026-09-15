import type { InstanceMap } from '@hub3js/std/types';

import {
  type Chain,
  type ChainId,
  type ProviderAPI as EvmProviderApi,
  type ProviderAPI,
  utils,
} from '@hub3js/evm';
import { EVM_NAMESPACE } from '@hub3js/namespaces';

export type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
};
export type Provider = InstanceMap<ProviderObject>;
export function rabby(): Provider | null {
  const { ethereum } = window;

  if (!ethereum?.isRabby) {
    return null;
  }

  const instances = new Map();

  instances.set(EVM_NAMESPACE, ethereum);

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = rabby();

  if (!instances) {
    throw new Error('Rabby is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmRabby(): EvmProviderApi {
  const instances = rabby();

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'Rabby not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance;
}
export async function switchOrAddNetwork(
  instance: ProviderAPI,
  chain: ChainId | Chain
) {
  try {
    const chainId = typeof chain === 'string' ? chain : chain.chainId;
    await utils.switchNetwork(instance, chainId);
  } catch (switchError) {
    const error = switchError as { code: number; message: string };

    /*
     * Workaround for handling unrecognized chain errors in rabby where error code -32603
     * (defined in EIP-1474 as an internal RPC error) is used instead of the metamask chain-not-found code.
     * Combine the code check with the specific error message "Unrecognized chain ID"
     * to reliably identify this scenario.
     */
    const NOT_FOUND_CHAIN_ERROR_CODE = -32603;
    const NOT_FOUND_ERROR_MESSAGE = 'Unrecognized chain ID';
    if (
      typeof chain !== 'string' &&
      error.code === NOT_FOUND_CHAIN_ERROR_CODE &&
      error.message.includes(NOT_FOUND_ERROR_MESSAGE)
    ) {
      await utils.suggestNetwork(instance, chain);
      return;
    }
    throw switchError;
  }
}
