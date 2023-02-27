import {
  isEvmAddress,
  Network,
  WalletInfo,
  WalletState,
  WalletType,
} from '@rangodev/wallets-shared';

import { WalletInfo as ModalWalletInfo, WalletState as WalletStatus } from '@rangodev/ui';
import { BestRouteResponse, BlockchainMeta, WalletDetail } from 'rango-sdk';
import { readAccountAddress } from '@rangodev/wallets-core';
import { Account } from '../store/wallets';
import { SelectableWallet } from '../pages/ConfirmWalletsPage';
import { Balance, TokenBalance } from '../store/wallets';
import BigNumber from 'bignumber.js';

export function getStateWallet(state: WalletState): WalletStatus {
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
}

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
  evmBasedChains: string[],
  supportedChainNames: Network[] | null,
): Account[] {
  const result: Account[] = [];

  function addAccount(network: Network, address: string) {
    const newAccount: Account = {
      address,
      chain: network,
      walletType: wallet,
    };

    result.push(newAccount);
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

  return result;
}

export function getRequiredChains(route: BestRouteResponse | null) {
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
}

export interface SelectedWallet extends Account {}

export function getSelectableWallets(
  accounts: Account[],
  requiredChains: string[],
  selectedWallets: SelectedWallet[],
  getWalletInfo: (type: WalletType) => WalletInfo,
) {
  const connectedWallets: SelectableWallet[] = accounts.map((account) => ({
    address: account.address,
    walletType: account.walletType,
    chain: account.chain,
    image: getWalletInfo(account.walletType).img,
    name: getWalletInfo(account.walletType).name,
    selected: !!selectedWallets.find(
      (wallet) => wallet.chain === account.chain && wallet.walletType === account.walletType,
    ),
  }));

  return connectedWallets.filter((wallet) => requiredChains.includes(wallet.chain));
}

export function getBalanceFromWallet(
  balances: Balance[],
  chain: string,
  symbol: string,
  address: string | null,
): TokenBalance | null {
  if (balances.length === 0) return null;

  const selectedChainBalances = balances.filter((balance) => balance.chain === chain);
  if (selectedChainBalances.length === 0) return null;

  return (
    selectedChainBalances
      .map(
        (a) =>
          a.balances?.find(
            (bl) =>
              (address !== null && bl.address === address) ||
              (address === null && bl.address === address && bl.symbol === symbol),
          ) || null,
      )
      .filter((b) => b !== null)
      .sort((a, b) => parseFloat(b?.amount || '0') - parseFloat(a?.amount || '1'))
      .find(() => true) || null
  );
}

export function isAccountAndBalanceMatched(account: Account, balance: Balance) {
  return (
    account.address === balance.address &&
    account.chain === balance.chain &&
    account.walletType === balance.walletType
  );
}

export function makeBalanceFor(account: Account, retrivedBalance: WalletDetail): Balance {
  const { address, blockChain: chain, explorerUrl, balances = [] } = retrivedBalance;
  return {
    address,
    chain,
    loading: false,
    error: false,
    explorerUrl,
    walletType: account.walletType,
    balances:
      balances?.map((tokenBalance) => ({
        chain,
        symbol: tokenBalance.asset.symbol,
        ticker: tokenBalance.asset.symbol,
        address: tokenBalance.asset.address || null,
        rawAmount: tokenBalance.amount.amount,
        decimal: tokenBalance.amount.decimals,
        amount: new BigNumber(tokenBalance.amount.amount)
          .shiftedBy(-tokenBalance.amount.decimals)
          .toFixed(),
        logo: '',
        usdPrice: null,
      })) || [],
  };
}

export function resetBalanceState(balance: Balance): Balance {
  return { ...balance, loading: false, error: true };
}
