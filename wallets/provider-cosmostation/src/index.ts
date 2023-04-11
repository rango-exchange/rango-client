import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  getCosmosAccounts,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import { cosmostation as cosmostation_instance } from './helpers';
import signer from './signer';
import {
  SignerFactory,
  BlockchainMeta,
  evmBlockchains,
  isEvmBlockchain,
  isCosmosBlockchain,
  cosmosBlockchains,
} from 'rango-types';

const WALLET = WalletType.COSMOSTATION;

export const config = {
  type: WALLET,
  defaultNetwork: Network.ETHEREUM,
};

export const getInstance = cosmostation_instance;
export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Network.ETHEREUM);
  const cosmosInstance = chooseInstance(instance, meta, Network.COSMOS);

  const results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push(evmResult);
  }

  if (cosmosInstance) {
    const cosmosBlockchainMeta = meta.filter(isCosmosBlockchain);
    const comsmosResult = await getCosmosAccounts({
      instance: cosmosInstance,
      meta: cosmosBlockchainMeta,
      network: Network.COSMOS,
    });
    if (Array.isArray(comsmosResult)) results.push(...comsmosResult);
    else results.push(comsmosResult);
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
  const ethInstance = instance.get(Network.ETHEREUM);
  const EvmBlockchainMeta = meta.filter(isEvmBlockchain);

  subscribeToEvm({
    instance: ethInstance,
    state,
    updateChainId,
    updateAccounts,
    meta: EvmBlockchainMeta,
    connect,
    disconnect,
  });

  window.cosmostation.cosmos.on('accountChanged', () => {
    disconnect();
    connect();
  });
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Cosmostation',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/cosmostation.png',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf',
      BRAVE:
        'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf',
      DEFAULT: 'https://cosmostation.io/',
    },
    color: 'black',
    supportedChains: [...evms, ...cosmos],
  };
};
