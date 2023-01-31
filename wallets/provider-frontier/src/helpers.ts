import { Network, ProviderConnectResult } from '@rangodev/wallets-shared';

export function frontier() {
  const { frontier } = window;


  if (frontier?.ethereum) return frontier?.ethereum;


  return null;
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
