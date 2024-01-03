import { Networks, ProviderConnectResult } from '@yeager-dev/wallets-shared';

export function frontier() {
  const { frontier } = window;
  if (!frontier) return null;

  const instances = new Map();
  if (frontier?.ethereum) instances.set(Networks.ETHEREUM, frontier?.ethereum);
  if (frontier?.solana) instances.set(Networks.SOLANA, frontier?.solana);

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
