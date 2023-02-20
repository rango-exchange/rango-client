import { Network, ProviderConnectResult } from '@rangodev/wallets-shared';

type Provider = Map<Network, any>;

export function mathWallet() {
  const instances = new Map();
  const { solana, ethereum } = window;

  if (!!solana && solana.isMathWallet)
    instances.set(Network.SOLANA, solana);

  if (ethereum && ethereum.isMathWallet)
    instances.set(Network.ETHEREUM, ethereum);

  if (instances.size === 0) return null;

  return instances;
}

export async function getNonEvmAccounts(
  instances: Provider
): Promise<ProviderConnectResult[]> {
  // Getting Solana accounts
  const solanaInstance = instances.get(Network.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (!!solanaInstance) {
    // Asking for account from wallet.
    const solanaResponse = await solanaInstance.connect();

    const solanaAccounts: string = solanaResponse.publicKey.toString();

    results.push({
      accounts: [solanaAccounts],
      chainId: Network.SOLANA,
    });
  }

  return results;
}
