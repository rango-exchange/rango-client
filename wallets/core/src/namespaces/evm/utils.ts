import type { Chain, ChainId, ProviderAPI } from './types.js';

export async function getAccounts(provider: ProviderAPI) {
  const [accounts, chainId] = await Promise.all([
    provider.request({ method: 'eth_requestAccounts' }),
    provider.request({ method: 'eth_chainId' }),
  ]);

  return {
    accounts,
    chainId,
  };
}

export async function suggestNetwork(instance: ProviderAPI, chain: Chain) {
  return await instance.request({
    method: 'wallet_addEthereumChain',
    params: [chain],
  });
}

export async function switchNetwork(instance: ProviderAPI, chainId: ChainId) {
  return await instance.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainId }],
  });
}

export async function switchOrAddNetwork(
  instance: ProviderAPI,
  chain: ChainId | Chain
) {
  try {
    const chainId = typeof chain === 'string' ? chain : chain.chainId;
    await switchNetwork(instance, chainId);
  } catch (switchError) {
    const error = switchError as { code: number; message: string };

    const NOT_FOUND_CHAIN_ERROR_CODE = 4902;
    if (
      typeof chain !== 'string' &&
      (error.code === NOT_FOUND_CHAIN_ERROR_CODE || !error.code)
    ) {
      /*
       * Note: on WalletConnect `code` is undefined so we have to use !switchError.code as fallback.
       * This error code indicates that the chain has not been added to wallet.
       */
      await suggestNetwork(instance, chain);
    }

    if (error instanceof Error) {
      throw error;
    }

    /*
     * Wrap the error to ensure it's an instance of Error.
     * In the `connect` flow, we rethrow the error in `cleanAccountSubscriber` only if it's an instance of Error.
     * If it's not, the error gets swallowed. This ensures proper error propagation.
     */
    throw new Error(error.message || 'Error encountered during network switch');
  }
}
