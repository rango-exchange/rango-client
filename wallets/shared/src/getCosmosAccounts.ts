import type { Connect, ProviderConnectResult } from './rango';
import type { Keplr as InstanceType } from '@keplr-wallet/types';
import type { StdBlockchainInfo, StdCosmosBlockchainInfo } from 'rango-types';
import { filterBlockchains } from './helpers';

const getCosmosMainChainsIds = (blockchains: StdCosmosBlockchainInfo[]) =>
  blockchains
    .filter((blockchain) => !!blockchain.manifest)
    .filter((blockchain) => !blockchain.manifest.experimental)
    .map((blockchain) => blockchain.chainId)
    .filter((chainId): chainId is string => !!chainId);

const getCosmosMiscChainsIds = (blockchains: StdCosmosBlockchainInfo[]) =>
  blockchains
    .filter((blockchain) => !!blockchain.manifest)
    .filter((blockchain) => blockchain.manifest?.experimental)
    .map((blockchain) => blockchain.chainId)
    .filter((chainId): chainId is string => !!chainId);

export const getCosmosExperimentalChainInfo = (
  blockchains: StdCosmosBlockchainInfo[]
): {
  [key: string]: StdCosmosBlockchainInfo['manifest'];
} =>
  blockchains
    .filter((blockchain) => !!blockchain.chainId && !!blockchain.manifest)
    .reduce(
      (obj, cur) => ({
        ...obj,
        [cur.id]: cur.manifest,
      }),
      {}
    );

async function getMainAccounts({
  desiredChainIds,
  instance,
}: {
  desiredChainIds: string[];
  instance: any;
}): Promise<ProviderConnectResult[]> {
  // Trying to get accounts from all chains
  const offlineSigners = desiredChainIds
    .map((chainId) => {
      const signer = instance.getOfflineSigner(chainId);
      return {
        signer,
        chainId,
      };
    })
    .filter(Boolean);
  const accountsPromises = offlineSigners.map(({ signer }) =>
    signer.getAccounts()
  );
  const availableAccountForChains = await Promise.allSettled(accountsPromises);
  const resolvedAccounts: ProviderConnectResult[] = [];
  availableAccountForChains.forEach((result, index) => {
    if (result.status !== 'fulfilled') {
      return;
    }

    const accounts = result.value;
    const { chainId } = offlineSigners[index];
    const addresses = accounts.map(
      (account: { address: any }) => account.address
    );

    resolvedAccounts.push({ accounts: addresses, chainId });
  });
  return resolvedAccounts;
}

async function tryRequestMiscAccounts({
  excludedChain,
  instance,
  meta,
}: {
  excludedChain?: string;
  instance: InstanceType;
  meta: StdBlockchainInfo[];
}): Promise<ProviderConnectResult[]> {
  const cosmosBlockchains = filterBlockchains(meta, {
    cosmos: true,
  }) as StdCosmosBlockchainInfo[];
  const offlineSigners = getCosmosMiscChainsIds(cosmosBlockchains)
    .filter((id) => id !== excludedChain)
    .map((chainId) => {
      const signer = instance.getOfflineSigner(chainId);
      return {
        signer,
        chainId,
      };
    });
  const accountsPromises = offlineSigners.map(async ({ signer }) =>
    signer.getAccounts()
  );
  const availableAccountForChains = await Promise.allSettled(accountsPromises);

  const resolvedAccounts: ProviderConnectResult[] = [];
  availableAccountForChains.forEach((result, index) => {
    if (result.status !== 'fulfilled') {
      return;
    }

    const accounts = result.value;
    const { chainId } = offlineSigners[index];
    const addresses = accounts.map((account) => account.address);

    resolvedAccounts.push({ accounts: addresses, chainId });
  });

  return resolvedAccounts;
}

export const getCosmosAccounts: Connect = async ({
  instance,
  network,
  meta,
}) => {
  const cosmosBlockchains = filterBlockchains(meta, {
    cosmos: true,
  }) as StdCosmosBlockchainInfo[];
  const chainInfo = network
    ? getCosmosExperimentalChainInfo(cosmosBlockchains)[network]
    : null;

  if (!!network && !chainInfo) {
    throw new Error(
      `You need to add ${network} to "COSMOS_EXPERIMENTAL_CHAINS_INFO" first.`
    );
  }
  // Asking for connect to wallet.
  if (!!chainInfo) {
    await instance.experimentalSuggestChain(chainInfo.info);
  }

  // Getting main chains + target network
  let desiredChainIds: string[] = getCosmosMainChainsIds(cosmosBlockchains);
  if (!!chainInfo) {
    desiredChainIds.push(chainInfo.id);
  }
  desiredChainIds = Array.from(new Set(desiredChainIds)).filter(Boolean);

  await instance.enable(desiredChainIds);

  const mainAccounts = await getMainAccounts({
    desiredChainIds,
    instance,
  });

  const exclude = !!chainInfo ? chainInfo.id : undefined;
  const miscAccounts = exclude
    ? await tryRequestMiscAccounts({
        instance,
        meta,
        excludedChain: exclude,
      })
    : [];

  const results = [...mainAccounts, ...miscAccounts];
  return results;
};
