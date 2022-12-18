import { Network, ProviderConnectResult } from '@rangodev/wallets-shared';

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
