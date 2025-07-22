import type { ProviderConnectResult } from '@arlert-dev/wallets-shared';

import { Networks } from '@arlert-dev/wallets-shared';

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
