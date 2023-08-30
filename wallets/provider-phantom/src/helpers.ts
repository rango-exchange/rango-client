import type { Network, ProviderConnectResult } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

type Provider = Map<Network, any>;

export function phantom() {
  const { phantom } = window;
  const { solana, ethereum } = phantom;

  if (!phantom) {
    return null;
  }

  const instances = new Map();

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
