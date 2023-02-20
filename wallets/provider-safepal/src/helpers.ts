import { Network, ProviderConnectResult } from '@rangodev/wallets-shared';

type Provider = Map<Network, any>;

export function safepal() {
  const instances = new Map();
  const { isSafePal, safepal, safepalProvider } = window;

  if (!isSafePal) return null;

  if (!!safepal && safepal.isSafePalWallet)
    instances.set(Network.SOLANA, safepal);

  if (safepalProvider && safepalProvider)
    instances.set(Network.ETHEREUM, safepalProvider);

  if (instances.size === 0) return null;

  return instances;
}

export async function getNonEvmAccounts(
  instances: Provider
): Promise<ProviderConnectResult[]> {
  const solanaInstance = instances.get(Network.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (!!solanaInstance) {
    const solanaResponse = await solanaInstance.connect();

    const solanaAccounts: string = solanaResponse.publicKey.toString();

    results.push({
      accounts: [solanaAccounts],
      chainId: Network.SOLANA,
    });
  }

  return results;
}
