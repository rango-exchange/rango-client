import {
  BlockchainMeta,
  CosmosBlockchainMeta,
  CosmosChainInfo,
} from 'rango-types';
import { deepCopy } from './helpers';
import { Connect, ProviderConnectResult } from './rango';
import { Keplr as InstanceType } from '@keplr-wallet/types';

export interface CosmosInfo extends Omit<CosmosChainInfo, 'experimental'> {
  chainId: string;
}

export type CosmosExperimentalChainsInfo = {
  [k: string]: { id: string; info: CosmosInfo; experimental: boolean };
};

interface CosmosBlockchainMetaWithChainId
  extends Omit<CosmosBlockchainMeta, 'chainId'> {
  chainId: string;
}

const getCosmosMainChainsIds = (blockchains: CosmosBlockchainMeta[]) =>
  blockchains
    .filter((blockchain) => !blockchain.info?.experimental)
    .map((blockchain) => blockchain.chainId)
    .filter((chainId): chainId is string => !!chainId);

const getCosmosMiscChainsIds = (blockchains: CosmosBlockchainMeta[]) =>
  blockchains
    .filter((blockchain) => blockchain.info?.experimental)
    .map((blockchain) => blockchain.chainId)
    .filter((chainId): chainId is string => !!chainId);

export const getCosmosExperimentalChainInfo = (
  blockchains: CosmosBlockchainMeta[]
) =>
  blockchains
    .filter((blockchain) => !!blockchain.info)
    .filter(
      (blockchain): blockchain is CosmosBlockchainMetaWithChainId =>
        !!blockchain.chainId
    )
    .reduce(
      (
        cosmosExperimentalChainsInfo: CosmosExperimentalChainsInfo,
        blockchain
      ) => {
        const info = deepCopy(blockchain.info) as CosmosChainInfo;
        info.stakeCurrency.coinImageUrl =
          window.location.origin + info.stakeCurrency.coinImageUrl;
        info.currencies = info.currencies.map((currency) => ({
          ...currency,
          coinImageUrl: window.location.origin + currency.coinImageUrl,
        }));
        info.feeCurrencies = info.feeCurrencies.map((currency) => ({
          ...currency,
          coinImageUrl: window.location.origin + currency.coinImageUrl,
        }));
        if (!info.gasPriceStep) delete info.gasPriceStep;
        const { experimental, ...otherProperties } = info;
        return (
          (cosmosExperimentalChainsInfo[blockchain.name] = {
            id: blockchain.chainId,
            info: { ...otherProperties, chainId: blockchain.chainId },
            experimental: experimental,
          }),
          cosmosExperimentalChainsInfo
        );
      },
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
    if (result.status !== 'fulfilled') return;

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
  meta: BlockchainMeta[];
}): Promise<ProviderConnectResult[]> {
  const offlineSigners = getCosmosMiscChainsIds(meta as CosmosBlockchainMeta[])
    .filter((id) => id !== excludedChain)
    .map((chainId) => {
      const signer = instance.getOfflineSigner(chainId);
      return {
        signer,
        chainId,
      };
    });
  const accountsPromises = offlineSigners.map(({ signer }) =>
    signer.getAccounts()
  );
  const availableAccountForChains = await Promise.allSettled(accountsPromises);

  const resolvedAccounts: ProviderConnectResult[] = [];
  availableAccountForChains.forEach((result, index) => {
    if (result.status !== 'fulfilled') return;

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
  const chainInfo = network
    ? getCosmosExperimentalChainInfo(meta as CosmosBlockchainMeta[])[network]
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
  let desiredChainIds: string[] = getCosmosMainChainsIds(
    meta as CosmosBlockchainMeta[]
  );
  if (!!chainInfo) {
    desiredChainIds.push(chainInfo!.id);
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
