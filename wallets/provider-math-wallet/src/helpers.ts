import type { Network, ProviderConnectResult } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

type Provider = Map<Network, any>;

export function mathWallet() {
  const instances = new Map();
  const { solana, ethereum, offlineSigner } = window;

  if (!!solana && solana.isMathWallet) {
    instances.set(Networks.SOLANA, solana);
  }

  if (ethereum && ethereum.isMathWallet) {
    instances.set(Networks.ETHEREUM, ethereum);
  }

  if (offlineSigner && offlineSigner.getAccounts) {
    instances.set(Networks.COSMOS, offlineSigner);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}

export async function getNonEvmAccounts(
  instances: Provider
): Promise<ProviderConnectResult[]> {
  // Getting Solana accounts
  const solanaInstance = instances.get(Networks.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (solanaInstance) {
    // Asking for account from wallet.
    const solanaResponse = await solanaInstance.connect();

    const solanaAccounts: string = solanaResponse.publicKey.toString();

    results.push({
      accounts: [solanaAccounts],
      chainId: Networks.SOLANA,
    });
  }

  // Getting Cosmos accounts
  const cosmosInstance = instances.get(Networks.COSMOS);
  if (cosmosInstance) {
    const [firstAccount] = await cosmosInstance.getAccounts();

    if (firstAccount) {
      results.push({
        accounts: [firstAccount.address],
        chainId: Networks.COSMOS,
      });
    }
  }

  return results;
}
