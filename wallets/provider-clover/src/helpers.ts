import { Network, ProviderConnectResult } from '@rangodev/wallets-shared';

export function clover() {
  const { clover, clover_solana } = window;

  if (!clover) return null;

  const instances = new Map();
  if (clover) instances.set(Network.ETHEREUM, clover);
  if (clover_solana) instances.set(Network.SOLANA, clover_solana);

  return instances;
}

type Provider = Map<Network, any>;

export async function getNonEvmAccounts(
  instances: Provider
): Promise<ProviderConnectResult[]> {
  const solanaInstance = instances.get(Network.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (!!solanaInstance) {
    const solanaAccounts = await solanaInstance.getAccount();

    results.push({
      accounts: [solanaAccounts],
      chainId: Network.SOLANA,
    });
  }

  return results;
}
