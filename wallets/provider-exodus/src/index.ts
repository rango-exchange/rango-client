import {
  Network,
  WalletType,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  switchNetworkForEvm,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import {
  exodus_instances,
  EXODUS_WALLET_SUPPORTED_CHAINS,
  getSolanaAccounts,
} from './helpers';
import signer from './signer';
import {
  SignerFactory,
  isEvmBlockchain,
  isSolanaBlockchain,
  BlockchainMeta,
} from 'rango-types';

const WALLET = WalletType.EXODUS;

export const config = {
  type: WALLET,
  // TODO: Get from evm networks
  defaultNetwork: Network.ETHEREUM,
};
export const getInstance = exodus_instances;

export const connect: Connect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Network.ETHEREUM);
  let results: ProviderConnectResult[] = [];

  if (evm_instance) {
    const evm = await getEvmAccounts(evm_instance);
    results.push(evm);
  }

  const solanaResults = await getSolanaAccounts(instance);
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
  const { connect, updateAccounts, state, updateChainId, meta } = options;
  ethInstance?.on('accountsChanged', (addresses: string[]) => {
    const eth_chainId = meta
      .filter(isEvmBlockchain)
      .find((blockchain) => blockchain.name === Network.ETHEREUM)?.chainId;
    if (state.connected) {
      if (state.network != Network.ETHEREUM && eth_chainId)
        updateChainId(eth_chainId);
      updateAccounts(addresses);
    }
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
    options.network
  );
  return switchNetworkForEvm({
    ...options,
    instance,
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => ({
  name: 'Exodus',
  img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/exodus.png',
  installLink: {
    CHROME:
      'https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
    BRAVE:
      'https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
    DEFAULT: 'https://www.exodus.com/',
  },
  color: '#8f70fa',
  supportedChains: allBlockChains.filter((blockchainMeta) =>
    EXODUS_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Network)
  ),
});
