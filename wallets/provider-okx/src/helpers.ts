import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider = Map<string, any>;

export function okx_instance() {
  const { okxwallet } = window;
  if (!okxwallet) {
    return null;
  }
  const instances = new Map();
  if (okxwallet) {
    instances.set(Networks.ETHEREUM, okxwallet);
  }
  if (okxwallet.solana) {
    instances.set(Networks.SOLANA, okxwallet.solana);
  }

  return instances;
}

export async function getSolanaAccounts(
  instance: Provider
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

export const OKX_WALLET_SUPPORTED_CHAINS = [
  Networks.ETHEREUM,
  Networks.BSC,
  Networks.SOLANA,
  Networks.POLYGON,
  Networks.FANTOM,
  Networks.ARBITRUM,
  Networks.OPTIMISM,
  Networks.CRONOS,
  Networks.BOBA,
  Networks.GNOSIS,
  Networks.MOONBEAM,
  Networks.MOONRIVER,
  Networks.HARMONY,
  Networks.AVAX_CCHAIN,
];
