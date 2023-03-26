import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
  getEvmAccounts,
  SwitchNetwork,
  switchNetworkForEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
} from '@rango-dev/wallets-shared';
import type { ProviderConnectResult } from '@rango-dev/wallets-shared';
import { frontier as frontier_instance, getSolanaAccounts } from './helpers';
import signer from './signer';
import {
  SignerFactory,
  isEvmBlockchain,
  BlockchainMeta,
  evmBlockchains,
  isSolanaBlockchain,
  solanaBlockchain,
} from 'rango-types';

const WALLET = WalletType.FRONTIER;

export const config = {
  type: WALLET,
  defaultNetwork: Network.ETHEREUM,
};

export const getInstance = frontier_instance;
export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Network.ETHEREUM);
  let results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push({
      chainId: evmResult?.chainId,
      accounts: evmResult?.accounts.length > 0 ? [evmResult.accounts[0]] : [],
    });
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
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);

  return {
    name: 'Frontier',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/frontier.png',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
      BRAVE:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
      DEFAULT: 'https://www.frontier.xyz',
    },
    color: '#4d40c6',
    supportedChains: [...evms, ...solana],
  };
};
