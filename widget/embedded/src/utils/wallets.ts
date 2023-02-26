import { BigNumber } from 'bignumber.js';
import {
  isEvmAddress,
  Network,
  WalletInfo,
  WalletState,
  WalletType,
} from '@rangodev/wallets-shared';

import { WalletInfo as ModalWalletInfo, WalletState as WalletStatus } from '@rangodev/ui';
import { BestRouteResponse, BlockchainMeta, Token } from 'rango-sdk';
import { readAccountAddress } from '@rangodev/wallets-core';
import { Account, AccountWithBalance, Balance } from '../store/wallets';
import { SelectableWallet } from '../pages/ConfirmWalletsPage';
import { getBalanceFromWallet, ZERO } from './balance';
import { numberToString } from './numbers';
import { TokenWithBalance } from '../pages/SelectTokenPage';

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
type Blockchain = { name: string; accounts: Balance[] };

export const getSelectableWallets = (
  accounts: Account[],
  selectedWallets: SelectedWallet[],
  getWalletInfo: (type: WalletType) => WalletInfo,
  requiredChains?: string[],
): SelectableWallet[] => {
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

  return requiredChains
    ? connectedWallets.filter((wallet) => requiredChains.includes(wallet.blockchain))
    : removeDuplicateWallets(connectedWallets, 'walletType');
};

const removeDuplicateWallets = (arr: SelectableWallet[], key: string): SelectableWallet[] => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

export const calculateWalletUsdValue = (balance: Balance[]) => {
  const uniqueAccountAddresses = new Set<string | null>();
  const uniqueBalane: Balance[] = balance?.reduce((acc: Balance[], current: Balance) => {
    return acc.findIndex((i) => i.address === current.address && i.chain === current.chain) === -1
      ? [...acc, current]
      : acc;
  }, []);

  const modifiedWalletBlockchains = uniqueBalane?.map((chain) => {
    const modifiedWalletBlockchain: Blockchain = { name: chain.chain, accounts: [] };
    if (!uniqueAccountAddresses.has(chain.address)) {
      uniqueAccountAddresses.add(chain.address);
    }
    uniqueAccountAddresses.forEach((accountAddress) => {
      if (chain.address === accountAddress) modifiedWalletBlockchain.accounts.push(chain);
    });
    return modifiedWalletBlockchain;
  });
  const total = numberToString(
    modifiedWalletBlockchains
      ?.flatMap((b) => b.accounts)
      ?.flatMap((a) => a?.balances)
      ?.map((b) => new BigNumber(b?.amount || ZERO).multipliedBy(b?.usdPrice || 0))
      ?.reduce((a, b) => a.plus(b), ZERO) || ZERO,
  ).toString();

  return numberWithThousandSeperator(total);
};

function numberWithThousandSeperator(number: string | number): string {
  var parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export const sortedTokens = (
  tokens: TokenWithBalance[],
  walletSymbols: Set<string>,
  position: 'from' | 'to',
  balance: Balance[],
): TokenWithBalance[] => {
  if (!tokens) return [];
  let sortedList = [
    ...tokens.filter((t) => !t.address && walletSymbols.size && position === 'to'),
    ...tokens
      .filter(
        (t) =>
          !(position === 'to' && !t.address) &&
          walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`),
      )
      .sort((tokenA, tokenB) => compareBalance(tokenA, tokenB, balance)),
    ...tokens.filter(
      (t) =>
        !walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`) &&
        !t.address &&
        (!walletSymbols.size || position === 'from'),
    ),
    ...tokens.filter(
      (t) =>
        !walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`) &&
        t.address &&
        !t.isSecondaryCoin,
    ),
    ...tokens.filter(
      (t) => !walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`) && t.isSecondaryCoin,
    ),
  ];

  return sortedList;
};

const compareBalance = (
  tokenA: TokenWithBalance,
  tokenB: TokenWithBalance,
  wallet: Balance[],
): number => {
  if (!tokenA.usdPrice || !tokenB.usdPrice) return 0;

  const tokenAUsdValue = new BigNumber(
    getBalanceFromWallet(wallet, tokenA.blockchain, tokenA.symbol, tokenA.address)?.amount || ZERO,
  ).multipliedBy(tokenA.usdPrice);
  const tokenBUsdValue = new BigNumber(
    getBalanceFromWallet(wallet, tokenB.blockchain, tokenB.symbol, tokenB.address)?.amount || ZERO,
  ).multipliedBy(tokenB.usdPrice);
  if (tokenAUsdValue.gt(tokenBUsdValue)) return -1;
  return 1;
};

export const getUsdPrice = (
  blockchain: string,
  symbol: string,
  address: string | null,
  allTokens: Token[],
): number | null => {
  const token = allTokens?.find(
    (t) =>
      t.blockchain === blockchain &&
      t.symbol?.toUpperCase() === symbol?.toUpperCase() &&
      t.address === address,
  );
  return token?.usdPrice || null;
};
