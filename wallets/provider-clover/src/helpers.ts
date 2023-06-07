import {
  Network,
  Networks,
  ProviderConnectResult,
} from '@rango-dev/wallets-shared';

export function clover() {
  const { clover, clover_solana } = window;

  if (!clover) return null;

  const instances = new Map();
  if (clover) instances.set(Networks.ETHEREUM, clover);
  if (clover_solana) instances.set(Networks.SOLANA, clover_solana);

  return instances;
}

type Provider = Map<Network, any>;

export async function getNonEvmAccounts(
  instances: Provider
): Promise<ProviderConnectResult[]> {
  const solanaInstance = instances.get(Networks.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (solanaInstance) {
    const solanaAccounts = await solanaInstance.getAccount();

    results.push({
      accounts: [solanaAccounts],
      chainId: Networks.SOLANA,
    });
  }

  return results;
}
