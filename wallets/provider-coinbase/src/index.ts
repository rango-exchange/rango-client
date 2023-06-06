import {
  Network,
  WalletTypes,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  switchNetworkForEvm,
  getCoinbaseInstance as coinbase_instance,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import { getSolanaAccounts } from './helpers';
import type { SignerFactory, BlockchainMeta } from 'rango-types';
import signer from './signer';

import Rango from 'rango-types';

// For cjs compatibility.
const {
  evmBlockchains,
  solanaBlockchain,
  isSolanaBlockchain,
  isEvmBlockchain,
} = Rango;

const WALLET = WalletTypes.COINBASE;

export const config = {
  type: WALLET,
  defaultNetwork: Network.ETHEREUM,
};

export const getInstance = coinbase_instance;
export const connect: Connect = async ({ instance, meta }) => {
  // Note: We need to get `chainId` here, because for the first time
  // after opening the browser, wallet is locked, and don't give us accounts and chainId
  // on `check` phase, so `network` will be null. For this case we need to get chainId
  // whenever we are requesting accounts.
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
export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Coinbase',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/coinbase.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
      BRAVE:
        'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
      DEFAULT: 'https://www.coinbase.com/wallet',
    },
    color: '#2a62f5',
    supportedChains: [...evms, ...solana],
  };
};
