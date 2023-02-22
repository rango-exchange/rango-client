import {
  isEvmAddress,
  Network,
  WalletInfo,
  WalletState,
  WalletType,
} from '@rangodev/wallets-shared';

import { WalletInfo as ModalWalletInfo, WalletState as WalletStatus } from '@rangodev/ui';
import { BestRouteResponse, BlockchainMeta } from 'rango-sdk';
import { readAccountAddress } from '@rangodev/wallets-core';
import { Account, Balance } from '../store/wallets';
import { SelectableWallet } from '../pages/ConfirmWalletsPage';

export const getStateWallet = (state: WalletState): WalletStatus => {
  switch (true) {
    case state.connected:
      return WalletStatus.CONNECTED;
    case state.connecting:
      return WalletStatus.CONNECTING;
    case !state.installed:
      return WalletStatus.NOT_INSTALLED;
    default:
      return WalletStatus.DISCONNECTED;
  }
};

export function getlistWallet(
  getState: (type: WalletType) => WalletState,
  getWalletInfo: (type: WalletType) => WalletInfo,
  list: WalletType[],
): ModalWalletInfo[] {
  const excludedWallets = [WalletType.UNKNOWN, WalletType.TERRA_STATION, WalletType.LEAP];

  return list
    .filter((wallet) => !excludedWallets.includes(wallet))
    .map((type) => {
      const { name, img: image, installLink } = getWalletInfo(type);
      const state = getStateWallet(getState(type));
      return {
        name,
        image,
        installLink,
        state,
        type,
      };
    });
}

export function walletAndSupportedChainsNames(supportedChains: BlockchainMeta[]): Network[] | null {
  if (!supportedChains) return null;
  let walletAndSupportedChainsNames: Network[] = [];
  walletAndSupportedChainsNames = supportedChains.map(
    (blockchainMeta) => blockchainMeta.name as Network,
  );

  return walletAndSupportedChainsNames;
}

export function prepareAccountsForWalletStore(
  wallet: WalletType,
  accounts: string[],
  connectedNetwork: Network | null,
  evmBasedChains: string[],
  supportedChainNames: Network[] | null,
): Balance[] {
  const result = {} as { [type in Network]: Balance };

  function addAccount(network: Network, address: string) {
    const isConnected = network === connectedNetwork;
    const newAccount = {
      address,
      balances: null,
      loading: true,
      walletType: wallet,
      isConnected,
      error: false,
      explorerUrl: null,
    };

    if (!!result[network]) {
      result[network].accountsWithBalance.push(newAccount);
    } else {
      result[network] = {
        blockchain: network,
        accountsWithBalance: [newAccount],
      };
    }
  }

  const supportedChains = supportedChainNames || [];

  accounts.forEach((account) => {
    const { address, network } = readAccountAddress(account);

    const hasLimitation = supportedChains.length > 0;
    const isSupported = supportedChains.includes(network);
    const isUnknown = network === Network.Unknown;
    const notSupportedNetworkByWallet = hasLimitation && !isSupported && !isUnknown;

    // Here we check given `network` is not supported by wallet
    // And also the network is known.
    if (notSupportedNetworkByWallet) return;

    // In some cases we can handle unknown network by checking its address
    // pattern and act on it.
    // Example: showing our evm compatible netwrok when the uknown network is evem.
    // Otherwise, we stop executing this function.
    const isUknownAndEvmBased = network === Network.Unknown && isEvmAddress(address);
    if (isUnknown && !isUknownAndEvmBased) return;

    const isEvmBasedChain = evmBasedChains.includes(network);

    // If it's an evm network, we will add the address to all the evm chains.
    if (isEvmBasedChain || isUknownAndEvmBased) {
      // all evm chains are not supported in wallets, so we are adding
      // only to those that are supported by wallet.
      const evmChainsSupportedByWallet = supportedChains.filter((chain) =>
        evmBasedChains.includes(chain),
      );

      evmChainsSupportedByWallet.forEach((network) => {
        // EVM addresses are not case sensetive.
        // Some wallets like Binance-chain return some letters in uppercase which produces bugs in our wallet state.
        addAccount(network, address.toLowerCase());
      });
    } else {
      addAccount(network, address);
    }
  });

  return Object.values(result);
}

export const getRequiredChains = (route: BestRouteResponse | null) => {
  const wallets: string[] = [];

  route?.result?.swaps.forEach((swap) => {
    const currentStepFromBlockchain = swap.from.blockchain;
    const currentStepToBlockchain = swap.to.blockchain;
    let lastAddedWallet = wallets[wallets.length - 1];
    if (currentStepFromBlockchain != lastAddedWallet) wallets.push(currentStepFromBlockchain);
    lastAddedWallet = wallets[wallets.length - 1];
    if (currentStepToBlockchain != lastAddedWallet) wallets.push(currentStepToBlockchain);
  });
  return wallets;
};

export interface SelectedWallet {
  address: string;
  walletType: WalletType;
  blockchain: string;
}

export const getSelectableWallets = (
  accounts: Account[],
  requiredChains: string[],
  selectedWallets: SelectedWallet[],
  getWalletInfo: (type: WalletType) => WalletInfo,
) => {
  const connectedWallets: SelectableWallet[] = [];
  accounts.forEach((account) => {
    account.accounts.forEach((acc) => {
      connectedWallets.push({
        address: acc.address,
        walletType: acc.walletType as WalletType,
        blockchain: account.blockchain,
        image: getWalletInfo(acc.walletType as WalletType).img,
        selected: !!selectedWallets.find((wallet) => wallet.blockchain === account.blockchain),
      });
    });
  });

  return connectedWallets.filter((wallet) => requiredChains.includes(wallet.blockchain));
};
