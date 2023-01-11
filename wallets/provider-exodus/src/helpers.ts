import { Network, ProviderConnectResult } from '@rangodev/wallets-shared';

export function exodus_instances() {
  const { exodus } = window;

  if (!exodus) return null;

  const instances = new Map();
  if (exodus.ethereum) instances.set(Network.ETHEREUM, exodus.ethereum);
  if (exodus.solana) instances.set(Network.SOLANA, exodus.solana);
  return instances;
}

export async function getSolanaAccounts(
  instance: any
): Promise<ProviderConnectResult[]> {
  const solanaInstance = await instance.get(Network.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (!!solanaInstance) {
    const solanaResponse = await solanaInstance.connect();
    const account = solanaResponse.publicKey.toString();

    results.push({
      accounts: account ? [account] : [],
      chainId: Network.SOLANA,
    });
  }

  return results;
}
const BNB_SYMBOL = "BNB";

export const EXODUS_WALLET_SUPPORTED_CHAINS = [
  Network.SOLANA,
  Network.ETHEREUM,
  Network.BSC,
  Network.POLYGON,
  Network.AVAX_CCHAIN,
  BNB_SYMBOL,
];
