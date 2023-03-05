import {
  getCosmosExperimentalChainInfo,
  isEvmAddress,
  KEPLR_COMPATIBLE_WALLETS,
  Network,
  WalletInfo,
  WalletState,
  WalletType,
  isCosmosBlockchain,
} from '@rango-dev/wallets-shared';

import {
  WalletInfo as ModalWalletInfo,
  WalletState as WalletStatus,
} from '@rango-dev/ui';
import {
  BestRouteResponse,
  BlockchainMeta,
  Token,
  WalletDetail,
} from 'rango-sdk';
import { readAccountAddress } from '@rango-dev/wallets-core';
import { SelectableWallet } from '../pages/ConfirmWalletsPage';
import { Account, Balance, TokenBalance } from '../store/wallets';
import { numberToString } from './numbers';
import BigNumber from 'bignumber.js';
import { TokenWithBalance } from '../pages/SelectTokenPage';
import { ZERO } from '../constants/numbers';

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

export const excludedWallets = [
  WalletType.UNKNOWN,
  WalletType.TERRA_STATION,
  WalletType.LEAP,
];

export function getlistWallet(
  getState: (type: WalletType) => WalletState,
  getWalletInfo: (type: WalletType) => WalletInfo,
  list: WalletType[]
): ModalWalletInfo[] {
  const excludedWallets = [
    WalletType.UNKNOWN,
    WalletType.TERRA_STATION,
    WalletType.LEAP,
  ];

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

export function walletAndSupportedChainsNames(
  supportedChains: BlockchainMeta[]
): Network[] | null {
  if (!supportedChains) return null;
  let walletAndSupportedChainsNames: Network[] = [];
  walletAndSupportedChainsNames = supportedChains.map(
    (blockchainMeta) => blockchainMeta.name as Network
  );

  return walletAndSupportedChainsNames;
}

export function prepareAccountsForWalletStore(
  wallet: WalletType,
  accounts: string[],
  evmBasedChains: string[],
  supportedChainNames: Network[] | null
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
    const notSupportedNetworkByWallet =
      hasLimitation && !isSupported && !isUnknown;

    // Here we check given `network` is not supported by wallet
    // And also the network is known.
    if (notSupportedNetworkByWallet) return;

    // In some cases we can handle unknown network by checking its address
    // pattern and act on it.
    // Example: showing our evm compatible netwrok when the uknown network is evem.
    // Otherwise, we stop executing this function.
    const isUknownAndEvmBased =
      network === Network.Unknown && isEvmAddress(address);
    if (isUnknown && !isUknownAndEvmBased) return;

    const isEvmBasedChain = evmBasedChains.includes(network);

    // If it's an evm network, we will add the address to all the evm chains.
    if (isEvmBasedChain || isUknownAndEvmBased) {
      // all evm chains are not supported in wallets, so we are adding
      // only to those that are supported by wallet.
      const evmChainsSupportedByWallet = supportedChains.filter((chain) =>
        evmBasedChains.includes(chain)
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
    if (currentStepFromBlockchain != lastAddedWallet)
      wallets.push(currentStepFromBlockchain);
    lastAddedWallet = wallets[wallets.length - 1];
    if (currentStepToBlockchain != lastAddedWallet)
      wallets.push(currentStepToBlockchain);
  });
  return wallets;
}

export interface SelectedWallet extends Account {}
type Blockchain = { name: string; accounts: Balance[] };

export function getSelectableWallets(
  accounts: Account[],
  selectedWallets: SelectedWallet[],
  getWalletInfo: (type: WalletType) => WalletInfo,
  requiredChains?: string[]
) {
  const connectedWallets: SelectableWallet[] = accounts.map((account) => ({
    address: account.address,
    walletType: account.walletType,
    chain: account.chain,
    image: getWalletInfo(account.walletType).img,
    name: getWalletInfo(account.walletType).name,
    selected: !!selectedWallets.find(
      (wallet) =>
        wallet.chain === account.chain &&
        wallet.walletType === account.walletType
    ),
  }));

  return requiredChains
    ? connectedWallets.filter(
        (wallet, index, array) =>
          requiredChains.includes(wallet.chain) &&
          array.findIndex((w) => w.address === wallet.address) === index
      )
    : removeDuplicateWallets(connectedWallets, 'walletType');
}

const removeDuplicateWallets = (
  arr: SelectableWallet[],
  key: string
): SelectableWallet[] => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

export function getBalanceFromWallet(
  balances: Balance[],
  chain: string,
  symbol: string,
  address: string | null
): TokenBalance | null {
  if (balances.length === 0) return null;

  const selectedChainBalances = balances.filter(
    (balance) => balance.chain === chain
  );
  if (selectedChainBalances.length === 0) return null;

  return (
    selectedChainBalances
      .map(
        (a) =>
          a.balances?.find(
            (bl) =>
              (address !== null && bl.address === address) ||
              (address === null &&
                bl.address === address &&
                bl.symbol === symbol)
          ) || null
      )
      .filter((b) => b !== null)
      .sort(
        (a, b) => parseFloat(b?.amount || '0') - parseFloat(a?.amount || '1')
      )
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

export function makeBalanceFor(
  account: Account,
  retrivedBalance: WalletDetail,
  tokens: Token[]
): Balance {
  const {
    address,
    blockChain: chain,
    explorerUrl,
    balances = [],
  } = retrivedBalance;
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
        usdPrice:
          getUsdPrice(
            chain,
            tokenBalance.asset.symbol,
            tokenBalance.asset.address,
            tokens
          ) || null,
      })) || [],
  };
}

export function resetBalanceState(balance: Balance): Balance {
  return { ...balance, loading: false, error: true };
}

export const calculateWalletUsdValue = (balance: Balance[]) => {
  const uniqueAccountAddresses = new Set<string | null>();
  const uniqueBalane: Balance[] = balance?.reduce(
    (acc: Balance[], current: Balance) => {
      return acc.findIndex(
        (i) => i.address === current.address && i.chain === current.chain
      ) === -1
        ? [...acc, current]
        : acc;
    },
    []
  );

  const modifiedWalletBlockchains = uniqueBalane?.map((chain) => {
    const modifiedWalletBlockchain: Blockchain = {
      name: chain.chain,
      accounts: [],
    };
    if (!uniqueAccountAddresses.has(chain.address)) {
      uniqueAccountAddresses.add(chain.address);
    }
    uniqueAccountAddresses.forEach((accountAddress) => {
      if (chain.address === accountAddress)
        modifiedWalletBlockchain.accounts.push(chain);
    });
    return modifiedWalletBlockchain;
  });
  const total = numberToString(
    modifiedWalletBlockchains
      ?.flatMap((b) => b.accounts)
      ?.flatMap((a) => a?.balances)
      ?.map((b) =>
        new BigNumber(b?.amount || ZERO).multipliedBy(b?.usdPrice || 0)
      )
      ?.reduce((a, b) => a.plus(b), ZERO) || ZERO
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
  position: 'from' | 'to',
  balance: Balance[]
): TokenWithBalance[] => {
  if (!tokens) return [];
  const walletSymbols = new Set(
    (balance || [])
      .flatMap((a) => a.balances || [])
      .filter((b) => (new BigNumber(b?.rawAmount) || ZERO).gt(0))
      .map((b) => `${b?.chain}.${b?.symbol}.${b?.address}`)
  );
  let sortedList = [
    ...tokens.filter(
      (t) => !t.address && walletSymbols.size && position === 'to'
    ),
    ...tokens
      .filter(
        (t) =>
          !(position === 'to' && !t.address) &&
          walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`)
      )
      .sort((tokenA, tokenB) => compareBalance(tokenA, tokenB, balance)),
    ...tokens.filter(
      (t) =>
        !walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`) &&
        !t.address &&
        (!walletSymbols.size || position === 'from')
    ),
    ...tokens.filter(
      (t) =>
        !walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`) &&
        t.address &&
        !t.isSecondaryCoin
    ),
    ...tokens.filter(
      (t) =>
        !walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`) &&
        t.isSecondaryCoin
    ),
  ];

  return sortedList;
};

const compareBalance = (
  tokenA: TokenWithBalance,
  tokenB: TokenWithBalance,
  wallet: Balance[]
): number => {
  if (!tokenA.usdPrice || !tokenB.usdPrice) return 0;

  const tokenAUsdValue = new BigNumber(
    getBalanceFromWallet(
      wallet,
      tokenA.blockchain,
      tokenA.symbol,
      tokenA.address
    )?.amount || ZERO
  ).multipliedBy(tokenA.usdPrice);
  const tokenBUsdValue = new BigNumber(
    getBalanceFromWallet(
      wallet,
      tokenB.blockchain,
      tokenB.symbol,
      tokenB.address
    )?.amount || ZERO
  ).multipliedBy(tokenB.usdPrice);
  if (tokenAUsdValue.gt(tokenBUsdValue)) return -1;
  return 1;
};

export const getUsdPrice = (
  blockchain: string,
  symbol: string,
  address: string | null,
  allTokens: Token[]
): number | null => {
  const token = allTokens?.find(
    (t) =>
      t.blockchain === blockchain &&
      t.symbol?.toUpperCase() === symbol?.toUpperCase() &&
      t.address === address
  );
  return token?.usdPrice || null;
};
export const isExperimentalChain = (
  blockchains: BlockchainMeta[],
  wallet: string
): boolean => {
  const cosmosExperimentalChainInfo = getCosmosExperimentalChainInfo(
    Object.entries(blockchains)
      .map(([, blockchainMeta]) => blockchainMeta)
      .filter(isCosmosBlockchain)
  );
  return cosmosExperimentalChainInfo && !!cosmosExperimentalChainInfo[wallet];
};

export const getKeplrCompatibleConnectedWallets = (
  selectableWallets: SelectableWallet[]
): WalletType[] => {
  const connectedWalletTypes = new Set(
    selectableWallets.map((a: any) => a.walletType.toString())
  );

  return KEPLR_COMPATIBLE_WALLETS.filter((compatibleWallet) =>
    connectedWalletTypes.has(compatibleWallet)
  );
};
