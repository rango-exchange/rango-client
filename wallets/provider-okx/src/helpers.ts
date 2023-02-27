import { Network, ProviderConnectResult } from '@rango-dev/wallets-shared';

export function okx_instance() {
  const { okxwallet } = window;
  if (!okxwallet) return null;
  const instances = new Map();
  if (okxwallet) instances.set(Network.ETHEREUM, okxwallet);
  if (okxwallet.solana) instances.set(Network.SOLANA, okxwallet.solana);

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

export const OKX_WALLET_SUPPORTED_CHAINS = [
  Network.ETHEREUM,
  Network.BTC,
  Network.BSC,
  Network.TRON,
  Network.SOLANA,
  Network.POLYGON,
  Network.FANTOM,
  Network.ARBITRUM,
  Network.OPTIMISM,
  Network.CRONOS,
  Network.BOBA,
  Network.GNOSIS,
  Network.MOONBEAM,
  Network.MOONRIVER,
  Network.HARMONY,
  Network.LTC,
  Network.AVAX_CCHAIN,
];
