import { Network, ProviderConnectResult } from '@rangodev/wallets-shared';

export function frontier() {
  const { frontier }: any = window;

  const instances = new Map();

  if (frontier?.ethereum) instances.set(Network.ETHEREUM, frontier?.ethereum);
  if (!!frontier?.solana) instances.set(Network.SOLANA, frontier?.solana);
  if (!!frontier?.cosmos) instances.set(Network.COSMOS, frontier?.cosmos);


  if (instances.size === 0) return null;

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
