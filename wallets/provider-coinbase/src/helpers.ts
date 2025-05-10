import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider = Map<string, any>;

export function coinbase() {
  const { coinbaseWalletExtension, coinbaseSolana } = window;

  const instances = new Map();
  if (coinbaseWalletExtension) {
    instances.set(Networks.ETHEREUM, coinbaseWalletExtension);
  }

  if (!!coinbaseSolana) {
    instances.set(Networks.SOLANA, coinbaseSolana);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}

export async function getSolanaAccounts(
  instance: Provider
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
