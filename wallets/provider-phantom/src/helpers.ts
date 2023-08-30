import type { Network, ProviderConnectResult } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

type Provider = Map<Network, any>;

export function phantomInstances(): Provider | null {
  const { phantom } = window;

  if (!phantom) {
    return null;
  }

  const { solana, ethereum } = phantom;

  const instances: Provider = new Map();

  if (ethereum && ethereum.isPhantom) {
    instances.set(Networks.ETHEREUM, ethereum);
  }

  if (solana && phantom.isPhantom) {
    instances.set(Networks.SOLANA, solana);
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
