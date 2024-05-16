import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import { getEvmInstanceFor, Networks } from '@rango-dev/wallets-shared';

const getEvmInstance = getEvmInstanceFor('Exodus');

export async function exodus_instances() {
  const { exodus } = window;
  const instances = new Map();

  if (exodus?.solana) {
    instances.set(Networks.SOLANA, exodus.solana);
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

export const EXODUS_WALLET_SUPPORTED_CHAINS = [
  Networks.SOLANA,
  Networks.ETHEREUM,
  Networks.BSC,
  Networks.POLYGON,
  Networks.AVAX_CCHAIN,
  Networks.BINANCE,
];
