import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import { getEvmInstanceFor, Networks } from '@rango-dev/wallets-shared';

const getEvmInstance = getEvmInstanceFor('Coinbase Wallet');

export async function coinbase() {
  const { coinbaseSolana } = window;

  const instances = new Map();

  if (!!coinbaseSolana) {
    instances.set(Networks.SOLANA, coinbaseSolana);
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

export async function getSolanaAccounts(
  instance: any
): Promise<ProviderConnectResult[]> {
  const solanaInstance = await instance.get(Networks.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (solanaInstance) {
    await solanaInstance.connect();
    const account = solanaInstance.publicKey.toString();

    results.push({
      accounts: account ? [account] : [],
      chainId: Networks.SOLANA,
    });
  }

  return results;
}
