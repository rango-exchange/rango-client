import type { Network, ProviderConnectResult } from '@rango-dev/wallets-shared';

import { getEvmInstanceFor, Networks } from '@rango-dev/wallets-shared';

type Provider = Map<Network, any>;

const getEvmInstance = getEvmInstanceFor('SafePal');

export async function safepal() {
  const instances = new Map();
  const { isSafePal, safepal } = window;

  if (!isSafePal) {
    return null;
  }

  if (!!safepal && safepal.isSafePalWallet) {
    instances.set(Networks.SOLANA, safepal);
  }

  const evmInstance = await getEvmInstance();
  if (evmInstance) {
    instances.set(Networks.ETHEREUM, evmInstance);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}

export async function getNonEvmAccounts(
  instances: Provider
): Promise<ProviderConnectResult[]> {
  const solanaInstance = instances.get(Networks.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (solanaInstance) {
    const solanaResponse = await solanaInstance.connect();

    const solanaAccounts: string = solanaResponse.publicKey.toString();

    results.push({
      accounts: [solanaAccounts],
      chainId: Networks.SOLANA,
    });
  }

  return results;
}
