import { LegacyNetworks } from '@arlert-dev/wallets-core/legacy';
import {
  type Chain,
  type ChainId,
  type ProviderAPI as EvmProviderApi,
  type ProviderAPI,
  utils,
} from '@arlert-dev/wallets-core/namespaces/evm';

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
