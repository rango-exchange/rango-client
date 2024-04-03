import type { NamespaceProvider } from './types';

export async function getAccounts(provider: NamespaceProvider) {
  const [accounts, chainId] = await Promise.all([
    provider.request({ method: 'eth_requestAccounts' }),
    provider.request({ method: 'eth_chainId' }),
  ]);

  return {
    accounts,
    chainId,
  };
}
