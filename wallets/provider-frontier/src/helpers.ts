import { Network, ProviderConnectResult } from '@rangodev/wallets-shared';

export function frontier() {
  const { frontier } = window;
  if (!frontier) return null;

  const instances = new Map();
  if (frontier?.ethereum) instances.set(Network.ETHEREUM, frontier?.ethereum);
  if (frontier?.solana) instances.set(Network.SOLANA, frontier?.solana);

  return instances;
}

export async function getSolanaAccounts(
  instance: any
): Promise<ProviderConnectResult[]> {
  const solanaInstance = await instance.get(Network.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (!!solanaInstance) {
    await solanaInstance.connect();
    const account = solanaInstance.publicKey.toString();

    results.push({
      accounts: account ? [account] : [],
      chainId: Network.SOLANA,
    });
  }

  return results;
}
