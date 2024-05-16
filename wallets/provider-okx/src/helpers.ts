import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import { getEvmInstanceFor, Networks } from '@rango-dev/wallets-shared';

const getEvmInstance = getEvmInstanceFor('OKX Wallet');

export async function okx_instance() {
  const { okxwallet } = window;
  const instances = new Map();

  if (okxwallet?.solana) {
    instances.set(Networks.SOLANA, okxwallet.solana);
  }

  const evmInstance = await getEvmInstance();
  if (evmInstance) {
    instances.set(Networks.ETHEREUM, evmInstance);
  }

  if (instances.size === 0) {
    return null;
  }

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
