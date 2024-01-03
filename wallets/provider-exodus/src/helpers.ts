import { Networks, ProviderConnectResult } from '@yeager-dev/wallets-shared';

export function exodus_instances() {
  const { exodus } = window;

  if (!exodus) return null;

  const instances = new Map();
  if (exodus.ethereum) instances.set(Networks.ETHEREUM, exodus.ethereum);
  if (exodus.solana) instances.set(Networks.SOLANA, exodus.solana);
  return instances;
}

export async function getSolanaAccounts(
  instance: any
): Promise<ProviderConnectResult[]> {
  const solanaInstance = await instance.get(Networks.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (solanaInstance) {
    const solanaResponse = await solanaInstance.connect();
    const account = solanaResponse.publicKey.toString();

    results.push({
      accounts: account ? [account] : [],
      chainId: Networks.SOLANA,
    });
  }

  return results;
}

export const EXODUS_WALLET_SUPPORTED_CHAINS = [
  Networks.SOLANA,
  Networks.ETHEREUM,
  Networks.BSC,
  Networks.POLYGON,
  Networks.AVAX_CCHAIN,
  Networks.BINANCE,
];
