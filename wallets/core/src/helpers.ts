import WalletConnectProvider from '@walletconnect/ethereum-provider';
import {
  convertEvmBlockchainMetaToEvmChainInfo,
  evmChainsToRpcMap,
  Network,
  WalletType,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { State, WalletProvider, WalletProviders } from './types';
import { Options, State as WalletState } from './wallet';
import type { BlockchainMeta } from 'rango-types';
import Rango from 'rango-types';

// For cjs compatibility.
const { isEvmBlockchain } = Rango;

export function choose(wallets: any[], type: WalletType): any | null {
  return wallets.find((wallet) => wallet.type === type) || null;
}

export const defaultWalletState: WalletState = {
  connected: false,
  connecting: false,
  reachable: false,
  installed: false,
  accounts: null,
  network: null,
};

export function state_reducer(state: State, action: any) {
  if (action.type === 'new_state') {
    // TODO fix problem and remove ts-ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const target_wallet = state[action.wallet];
    if (!target_wallet) {
      return {
        ...state,
        [action.wallet]: {
          ...defaultWalletState,
          [action.name]: action.value,
        },
      };
    }

    return {
      ...state,
      [action.wallet]: {
        ...target_wallet,
        [action.name]: action.value,
      },
    };
  }

  return state;
}

export function formatAddressWithNetwork(
  address: string,
  network?: Network | null
) {
  return `${network || ''}:${address}`;
}

export function accountAddressesWithNetwork(
  addresses: string[] | null,
  network?: Network | null
) {
  if (!addresses) return [];

  return addresses.map((address) => {
    return formatAddressWithNetwork(address, network);
  });
}

export function readAccountAddress(addressWithNetwork: string): {
  address: string;
  network: Network;
} {
  const [network, address] = addressWithNetwork.split(':');

  return {
    network: network as Network,
    address,
  };
}

export function connectedWallets(providersState: State): WalletType[] {
  return Object.entries(providersState)
    .filter(([, wallet_state]) => {
      return wallet_state?.connected;
    })
    .map(([type]) => {
      return type;
    });
}

export function availableWallets(providersState: State): WalletType[] {
  return Object.entries(providersState).map(([type]) => {
    return type;
  });
}

export function checkWalletProviders(list: WalletProvider[]): WalletProviders {
  const wallets: WalletProviders = new Map();

  list.forEach((provider) => {
    const { config, ...actions } = provider;
    wallets.set(config.type, {
      actions,
      config,
    });
  });

  return wallets;
}

/* eslint-disable @typescript-eslint/ban-types */
export function isAsync(fn: Function) {
  return fn?.constructor?.name === 'AsyncFunction';
}

export function needsCheckInstallation(options: Options) {
  const { checkInstallation = true } = options.config;
  return checkInstallation;
}

/*
  WalletConnect instance is not compatible with ethers.providers.Web3Provider,
  Here we are returning a comptable instance, instead of the original one.  
*/

export function isWalletDerivedFromWalletConnect(wallet_type: WalletType) {
  return wallet_type === WalletTypes.WALLET_CONNECT;
}

export function getComptaibleProvider(
  supportedChains: BlockchainMeta[],
  provider: any,
  type: WalletType
) {
  if (isWalletDerivedFromWalletConnect(type)) {
    const evmBlockchains = supportedChains.filter(isEvmBlockchain);
    const rpcUrls = evmChainsToRpcMap(
      convertEvmBlockchainMetaToEvmChainInfo(evmBlockchains)
    );
    return new WalletConnectProvider({
      qrcode: false,
      rpc: rpcUrls,
      connector: provider,
      chainId: provider.chainId,
    });
  }
  return provider;
}
