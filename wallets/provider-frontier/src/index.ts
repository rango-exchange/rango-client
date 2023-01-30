import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletSigners,
  BlockchainMeta,
  WalletInfo,
  solanaBlockchain,
  ProviderConnectResult,
  chooseInstance,
  getEvmAccounts,
  evmBlockchains,
  isEvmBlockchain,
  // isCosmosBlockchain,
  isSolanaBlockchain,
  SwitchNetwork,
  switchNetworkForEvm,
  canSwitchNetworkToEvm,
  cosmosBlockchains,
  // getCosmosAccounts,
  // getSolanaAccounts,
  // getSolanaAccounts,
} from '@rangodev/wallets-shared';
import {
  frontier as frontier_instance,
  //  getNonEvmAccounts
  getSolanaAccounts,
} from './helpers';
import signer from './signer';

const WALLET = WalletType.FRONTIER;

export const config = {
  type: WALLET,
};

export const getInstance = frontier_instance;
export const connect: Connect = async ({ instance, meta }) => {
  let results: ProviderConnectResult[] = [];

  const evm_instance = chooseInstance(instance, meta, Network.ETHEREUM);
  // const cosmosInstance = chooseInstance(instance, meta, Network.COSMOS);
  if (evm_instance) {
    const evm = await getEvmAccounts(evm_instance);
    results.push(evm);
  }

  const solanaResults = await getSolanaAccounts(instance);
  // const cosmosBlockchainMeta = meta.filter(isCosmosBlockchain);

  // const comsmosResult = await getCosmosAccounts({
  //   instance: cosmosInstance,
  //   meta: cosmosBlockchainMeta,
  //   network: Network.COSMOS,
  // });
  // if (Array.isArray(comsmosResult)) results.push(...comsmosResult);
  // else results.push(comsmosResult);

  results = [...results, ...solanaResults];
  return results;
};
export const subscribe: Subscribe = (options) => {
  const ethInstance = chooseInstance(
    options.instance,
    options.meta,
    Network.ETHEREUM
  );
  const solanaInstance = chooseInstance(
    options.instance,
    options.meta,
    Network.SOLANA
  );

  // const cosmosInstance = chooseInstance(
  //   options.instance,
  //   options.meta,
  //   Network.COSMOS
  // );
  const { connect, updateAccounts, meta, state, updateChainId } = options;
  ethInstance?.on('accountsChanged', (addresses: string[]) => {
    const eth_chainId = meta
      .filter(isEvmBlockchain)
      .find((blockchain) => blockchain.name === Network.ETHEREUM)?.chainId;
    updateAccounts(addresses, eth_chainId);
  });

  solanaInstance?.on('accountChanged', async (publicKey: string) => {
    if (state.network != Network.SOLANA)
      updateChainId(meta.filter(isSolanaBlockchain)[0].chainId);
    const network = Network.SOLANA;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      connect(network);
    }
  });
};

export const switchNetwork: SwitchNetwork = async (options) => {
  const instance = chooseInstance(
    options.instance,
    options.meta,
    Network.ETHEREUM
  );
  return switchNetworkForEvm({
    ...options,
    instance,
  });
};
export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;
export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Frontier',
    img: 'https://app.rango.exchange/wallets/phantom.svg',
    installLink:
      'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    color: '#4d40c6',
    supportedChains: [...evms, ...solana, ...cosmos],
  };
};
