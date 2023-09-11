import type {
  StdBlockchainInfo,
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  filterBlockchains,
  getCosmosAccounts,
  getEvmAccounts,
  Networks,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';

import { cosmostation as cosmostation_instance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.COSMOSTATION;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = cosmostation_instance;
export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const cosmosInstance = chooseInstance(instance, meta, Networks.COSMOS);

  const results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push(evmResult);
  }

  if (cosmosInstance) {
    const cosmosBlockchainMeta = meta.filter(
      (blockchain) => blockchain.type === 'COSMOS'
    );
    const comsmosResult = await getCosmosAccounts({
      instance: cosmosInstance,
      meta: cosmosBlockchainMeta,
      network: Networks.COSMOS,
    });
    if (Array.isArray(comsmosResult)) {
      results.push(...comsmosResult);
    } else {
      results.push(comsmosResult);
    }
  }

  return results;
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const subscribe: Subscribe = ({
  instance,
  state,
  updateChainId,
  updateAccounts,
  meta,
  connect,
  disconnect,
}) => {
  const ethInstance = instance.get(Networks.ETHEREUM);

  subscribeToEvm({
    instance: ethInstance,
    state,
    updateChainId,
    updateAccounts,
    meta,
    connect,
    disconnect,
  });

  window.cosmostation.cosmos.on('accountChanged', () => {
    disconnect();
    connect();
  });
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  if (evm_instance) {
    return canEagerlyConnectToEvm({ instance: evm_instance, meta });
  }
  return Promise.resolve(false);
};

export const getWalletInfo: (
  allBlockChains: StdBlockchainInfo[]
) => WalletInfo = (allBlockChains) => {
  const blockchains = filterBlockchains(allBlockChains, {
    evm: true,
    cosmos: true,
  });
  return {
    name: 'Cosmostation',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/cosmostation/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf',
      BRAVE:
        'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf',
      DEFAULT: 'https://cosmostation.io/',
    },
    color: 'black',
    supportedBlockchains: blockchains,
  };
};
