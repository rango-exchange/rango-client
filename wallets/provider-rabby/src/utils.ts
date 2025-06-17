import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import {
  type Chain,
  type ChainId,
  type ProviderAPI as EvmProviderApi,
  type ProviderAPI,
  utils,
} from '@rango-dev/wallets-core/namespaces/evm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider = Record<string, any>;
export function rabby(): Provider | null {
  const { ethereum } = window;

  if (!ethereum?.isRabby) {
    return null;
  }

  const instances = new Map();

  instances.set(LegacyNetworks.ETHEREUM, ethereum);

  return instances;
}

export function evmRabby(): EvmProviderApi {
  const instances = rabby();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Rabby not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}
export async function switchOrAddNetwork(
  instance: ProviderAPI,
  chain: ChainId | Chain
) {
  try {
    const chainId = typeof chain === 'string' ? chain : chain.chainId;
    await utils.switchNetwork(instance, chainId);
  } catch (switchError) {
    const error = switchError as { code: number };

    const NOT_FOUND_CHAIN_ERROR_CODE = -32603;
    if (
      typeof chain !== 'string' &&
      (error.code === NOT_FOUND_CHAIN_ERROR_CODE || !error.code)
    ) {
      /*
       * Note: on WalletConnect `code` is undefined so we have to use !switchError.code as fallback.
       * This error code indicates that the chain has not been added to wallet.
       */
      await utils.suggestNetwork(instance, chain);
    }
    throw switchError;
  }
}
