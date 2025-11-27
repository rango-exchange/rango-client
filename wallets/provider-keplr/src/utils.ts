import type { Provider } from './types.js';
import type {
  CosmosChainAccounts,
  ProviderAPI as CosmosProviderApi,
} from '@rango-dev/wallets-core/namespaces/cosmos';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function keplr(): Provider | null {
  const { keplr } = window;
  if (!keplr) {
    return null;
  }
  const instances: Provider = new Map();
  instances.set(LegacyNetworks.COSMOS, keplr);
  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = keplr();

  if (!instances) {
    throw new Error('Cosmos Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function cosmosKeplr(): CosmosProviderApi {
  const instances = keplr();

  const cosmosInstance = instances?.get(LegacyNetworks.COSMOS);

  if (!cosmosInstance) {
    throw new Error(
      'Keplr Wallet not injected or Cosmos not enabled. Please check your wallet.'
    );
  }

  return cosmosInstance;
}

const GET_ACCOUNTS_TIMEOUT = 1000;
export const getCosmosAccounts = async (
  instance: CosmosProviderApi,
  chainIds: string[],
  miscChainIds?: string[]
) => {
  await instance.enable(chainIds);

  // Trying to get accounts from chainIds and also miscChainIds
  const offlineSigners = chainIds
    .concat(miscChainIds || [])
    .map((chainId) => {
      const signer = instance.getOfflineSigner(chainId);
      return {
        signer,
        chainId,
      };
    })
    .filter(Boolean);

  // Set a timeout for fetching accounts
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error('Timeout while fetching accounts')),
      GET_ACCOUNTS_TIMEOUT
    )
  );
  const accountsPromises = offlineSigners.map(async ({ signer }) =>
    Promise.race([signer.getAccounts(), timeout])
  );
  const availableAccountForChains = await Promise.allSettled(accountsPromises);
  const accountsResult: CosmosChainAccounts[] = [];
  availableAccountForChains.forEach((fetchResult, index) => {
    if (fetchResult.status === 'fulfilled') {
      const { chainId } = offlineSigners[index];
      accountsResult.push({
        accounts: fetchResult.value.map(
          (account: { address: string }) => account.address
        ),
        chainId,
      });
    }
  });
  return accountsResult;
};
