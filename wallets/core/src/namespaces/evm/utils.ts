import type { Chain, ChainId, ProviderApi } from './types.js';

export async function getAccounts(provider: ProviderApi) {
  const [accounts, chainId] = await Promise.all([
    provider.request({ method: 'eth_requestAccounts' }),
    provider.request({ method: 'eth_chainId' }),
  ]);

  return {
    accounts,
    chainId,
  };
}

export async function suggestNetwork(instance: ProviderApi, chain: Chain) {
  return await instance.request({
    method: 'wallet_addEthereumChain',
    params: [chain],
  });
}

export async function switchNetwork(instance: ProviderApi, chainId: ChainId) {
  return await instance.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainId }],
  });
}

export async function switchOrAddNetwork(
  instance: ProviderApi,
  chain: ChainId | Chain
) {
  try {
    const chainId = typeof chain === 'string' ? chain : chain.chainId;
    await switchNetwork(instance, chainId);
  } catch (switchError) {
    const error = switchError as { code: number };

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
    throw switchError;
  }
}
