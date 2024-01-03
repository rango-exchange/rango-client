import {
  Network,
  Networks,
  ProviderConnectResult,
} from '@yeager-dev/wallets-shared';

type Provider = Map<Network, any>;

export function mathWallet() {
  const instances = new Map();
  const { solana, ethereum } = window;

  if (!!solana && solana.isMathWallet) instances.set(Networks.SOLANA, solana);

  if (ethereum && ethereum.isMathWallet)
    instances.set(Networks.ETHEREUM, ethereum);

  if (instances.size === 0) return null;

  return instances;
}

export async function getNonEvmAccounts(
  instances: Provider
): Promise<ProviderConnectResult[]> {
  // Getting Solana accounts
  const solanaInstance = instances.get(Networks.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (solanaInstance) {
    // Asking for account from wallet.
    const solanaResponse = await solanaInstance.connect();

    const solanaAccounts: string = solanaResponse.publicKey.toString();

    results.push({
      accounts: [solanaAccounts],
      chainId: Networks.SOLANA,
    });
  }

  return results;
}
