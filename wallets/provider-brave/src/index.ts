import {
  Network,
  WalletTypes,
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
  getSolanaAccounts,
} from '@rango-dev/wallets-shared';
import { brave as brave_instances } from './helpers';
import signer from './signer';
import {
  SignerFactory,
  isEvmBlockchain,
  isSolanaBlockchain,
  evmBlockchains,
  solanaBlockchain,
  ProviderMeta,
} from 'rango-types';

const WALLET = WalletTypes.BRAVE;

export const config = {
  type: WALLET,
  defaultNetwork: Network.ETHEREUM,
};

export const getInstance = brave_instances;

export const connect: Connect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Network.ETHEREUM);
  const sol_instance = chooseInstance(instance, meta, Network.SOLANA);
  const results: ProviderConnectResult[] = [];
  const emptyWalletErrorCode = -32603;
  const emptyWalletCustomErrorMessage = 'Please create or import a wallet';
  let numberOfEmptyWallets = 0;

  if (evm_instance) {
    try {
      const evmAccounts = await getEvmAccounts(evm_instance);
      results.push(evmAccounts);
    } catch (error) {
      // To resolve this error: Catch clause variable type annotation must be any or unknown if specified
      const err = error as { code: number };
      if (err.code === emptyWalletErrorCode) {
        numberOfEmptyWallets += 1;
      } else throw error;
    }
  }

  if (sol_instance) {
    try {
      const solanaAccounts = await getSolanaAccounts({
        instance: sol_instance,
        meta,
      });
      results.push(solanaAccounts as ProviderConnectResult);
    } catch (error) {
      // To resolve this error: Catch clause variable type annotation must be any or unknown if specified
      const err = error as { code: number };
      if (err.code === emptyWalletErrorCode) {
        numberOfEmptyWallets += 1;
      } else throw error;
    }
  }

  if (numberOfEmptyWallets === instance.size) throw new Error(emptyWalletCustomErrorMessage);

  return results;
};

export const subscribe: Subscribe = ({ instance, updateAccounts, meta, state, updateChainId }) => {
  const evm_instance = chooseInstance(instance, meta, Network.ETHEREUM);
  const sol_instance = chooseInstance(instance, meta, Network.SOLANA);

  evm_instance?.on('accountsChanged', (addresses: string[]) => {
    const eth_chainId = meta
      .filter(isEvmBlockchain)
      .find((blockchain) => blockchain.name === Network.ETHEREUM)?.chainId;
    if (state.connected) {
      if (state.network != Network.ETHEREUM && eth_chainId) updateChainId(eth_chainId);
      updateAccounts(addresses);
    }
  });

  evm_instance?.on('chainChanged', (chainId: string) => {
    updateChainId(chainId);
  });

  sol_instance?.on('accountChanged', async () => {
    if (state.network != Network.SOLANA) updateChainId(meta.filter(isSolanaBlockchain)[0].chainId);
    const response = await sol_instance.connect();
    const account: string = response.publicKey.toString();
    updateAccounts([account]);
  });
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: ProviderMeta[]) => WalletInfo = (allBlockChains) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Brave',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/brave.png',
    installLink: {
      DEFAULT: 'https://brave.com/wallet/',
    },
    color: '#ef342f',
    supportedChains: [...evms, ...solana],
  };
};
