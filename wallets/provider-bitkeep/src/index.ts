import {
  WalletTypes,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  SwitchNetwork,
  canSwitchNetworkToEvm,
  chooseInstance,
  Networks,
  ProviderConnectResult,
} from '@rango-dev/wallets-shared';
import {
  SignerFactory,
  BlockchainMeta,
  evmBlockchains,
  isEvmBlockchain,
  tronBlockchain,
} from 'rango-types';
import { bitKeepInstances } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.BITKEEP;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = bitKeepInstances;

export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const tronInstance = chooseInstance(instance, meta, Networks.TRON);

  const results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push(evmResult);
  }

  if (tronInstance) {
    const res = await tronInstance.request({ method: 'tron_requestAccounts' });
    if (!res) {
      throw new Error('Please unlock your TronLink extension first.');
    }
    if (!!res?.code && !!res.message && res.code !== 200) {
      throw new Error(res.message);
    }
    const address = tronInstance.tronWeb.defaultAddress.base58;
    results.push({
      accounts: address ? [address] : [],
      chainId: Networks.TRON,
    });
  }

  return results;
};

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
  const evmBlockchainMeta = meta.filter(isEvmBlockchain);

  subscribeToEvm({
    instance: ethInstance,
    state,
    updateChainId,
    updateAccounts,
    meta: evmBlockchainMeta,
    connect,
    disconnect,
  });

  window.addEventListener('message', (e) => {
    if (
      e.data.isTronLink &&
      e.data.message &&
      e.data.message.action == 'accountsChanged'
    ) {
      const account = e?.data?.message?.data?.address;
      if (account) {
        updateAccounts([account]);
      } else {
        disconnect();
      }
    }
  });
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const tron = tronBlockchain(allBlockChains);
  return {
    name: 'Bitkeep',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/bitkeep.png',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
      BRAVE:
        'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
      DEFAULT: 'https://bitkeep.com/en/download?type=2',
    },
    color: '#ffffff',
    supportedChains: [...evms, ...tron],
  };
};
