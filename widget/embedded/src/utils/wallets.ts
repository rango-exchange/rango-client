import type { ConnectedWallet, TokenBalance } from '../store/wallets';
import type {
  Balance,
  SelectedQuote,
  TokenHash,
  TokensBalance,
  Wallet,
} from '../types';
import type { WalletInfo as ModalWalletInfo } from '@rango-dev/ui';
import type {
  Asset,
  Network,
  WalletInfo,
  WalletState,
  WalletType,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, Token, WalletDetail } from 'rango-sdk';

import { WalletState as WalletStatus } from '@rango-dev/ui';
import { readAccountAddress } from '@rango-dev/wallets-react';
import {
  detectInstallLink,
  getCosmosExperimentalChainInfo,
  isEvmAddress,
  KEPLR_COMPATIBLE_WALLETS,
  Networks,
} from '@rango-dev/wallets-shared';
import BigNumber from 'bignumber.js';
import { isCosmosBlockchain } from 'rango-types';

import { ZERO } from '../constants/numbers';
import {
  BALANCE_MAX_DECIMALS,
  BALANCE_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../constants/routing';
import { EXCLUDED_WALLETS } from '../constants/wallets';

import { numberToString } from './numbers';

export function mapStatusToWalletState(state: WalletState): WalletStatus {
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

export function mapWalletTypesToWalletInfo(
  getState: (type: WalletType) => WalletState,
  getWalletInfo: (type: WalletType) => WalletInfo,
  list: WalletType[],
  chain?: string
): ModalWalletInfo[] {
  return list
    .filter((wallet) => !EXCLUDED_WALLETS.includes(wallet as WalletTypes))
    .filter((wallet) => {
      const { supportedChains, isContractWallet } = getWalletInfo(wallet);
      const { installed, network } = getState(wallet);
      const filterContractWallets =
        isContractWallet && (!installed || (!!chain && network !== chain));
      if (filterContractWallets) {
        return false;
      }
      if (chain) {
        return !!supportedChains.find(
          (supportedChain) => supportedChain.name === chain
        );
      }
      return true;
    })
    .map((type) => {
      const { name, img: image, installLink } = getWalletInfo(type);
      const state = mapStatusToWalletState(getState(type));
      return {
        title: name,
        image,
        link: detectInstallLink(installLink),
        state,
        type,
      };
    });
}

export function walletAndSupportedChainsNames(
  supportedBlockchains: BlockchainMeta[]
): Network[] | null {
  if (!supportedBlockchains) {
    return null;
  }
  let walletAndSupportedChainsNames: Network[] = [];
  walletAndSupportedChainsNames = supportedBlockchains.map(
    (blockchainMeta) => blockchainMeta.name
  );

  return walletAndSupportedChainsNames;
}

export function prepareAccountsForWalletStore(
  wallet: WalletType,
  accounts: string[],
  evmBasedChains: string[],
  supportedChainNames: Network[] | null,
  isContractWallet: boolean
): Wallet[] {
  const result: Wallet[] = [];

  function addAccount(network: Network, address: string) {
    const accountForChainAlreadyExists = !!result.find(
      (account) => account.chain === network
    );
    if (!accountForChainAlreadyExists) {
      const newAccount: Wallet = {
        address,
        chain: network,
        walletType: wallet,
      };

      result.push(newAccount);
    }
  }

  const supportedBlockchains = supportedChainNames || [];

  accounts.forEach((account) => {
    const { address, network } = readAccountAddress(account);

    const hasLimitation = supportedBlockchains.length > 0;
    const isSupported = supportedBlockchains.includes(network);
    const isUnknown = network === Networks.Unknown;
    const notSupportedNetworkByWallet =
      hasLimitation && !isSupported && !isUnknown;

    /*
     * Here we check given `network` is not supported by wallet
     * And also the network is known.
     */
    if (notSupportedNetworkByWallet) {
      return;
    }

    /*
     * In some cases we can handle unknown network by checking its address
     * pattern and act on it.
     * Example: showing our evm compatible network when the unknown network is evm.
     * Otherwise, we stop executing this function.
     */
    const isUnknownAndEvmBased =
      network === Networks.Unknown && isEvmAddress(address);
    if (isUnknown && !isUnknownAndEvmBased) {
      return;
    }

    const isEvmBasedChain = evmBasedChains.includes(network);

    // If it's an evm network, we will add the address to all the evm chains.
    if (isEvmBasedChain || isUnknownAndEvmBased) {
      if (isContractWallet) {
        /*
         * for contract wallets like Safe wallet, we should add only account for the
         * current connected blockchain not all of the supported blockchains
         */
        addAccount(network, address.toLowerCase());
      } else {
        /*
         * all evm chains are not supported in wallets, so we are adding
         * only to those that are supported by wallet.
         */
        const evmChainsSupportedByWallet = supportedBlockchains.filter(
          (chain) => evmBasedChains.includes(chain)
        );

        evmChainsSupportedByWallet.forEach((network) => {
          /*
           * EVM addresses are not case sensitive.
           * Some wallets like Binance-chain return some letters in uppercase which produces bugs in our wallet state.
           */
          addAccount(network, address.toLowerCase());
        });
      }
    } else {
      addAccount(network, address);
    }
  });

  return result;
}

export function getRequiredChains(quote: SelectedQuote | null) {
  const wallets: string[] = [];

  quote?.swaps.forEach((swap) => {
    const currentStepFromBlockchain = swap.from.blockchain;
    const currentStepToBlockchain = swap.to.blockchain;
    if (!wallets.includes(currentStepFromBlockchain)) {
      wallets.push(currentStepFromBlockchain);
    }
    if (!wallets.includes(currentStepToBlockchain)) {
      wallets.push(currentStepToBlockchain);
    }

    // Check if internalSwaps array exists
    if (swap.internalSwaps && Array.isArray(swap.internalSwaps)) {
      swap.internalSwaps.forEach((internalSwap) => {
        const internalStepFromBlockchain = internalSwap.from.blockchain;
        const internalStepToBlockchain = internalSwap.to.blockchain;
        if (!wallets.includes(internalStepFromBlockchain)) {
          wallets.push(internalStepFromBlockchain);
        }
        if (!wallets.includes(internalStepToBlockchain)) {
          wallets.push(internalStepToBlockchain);
        }
      });
    }
  });
  return wallets;
}

type Blockchain = { name: string; accounts: ConnectedWallet[] };

export function isAccountAndWalletMatched(
  account: Wallet,
  connectedWallet: ConnectedWallet
) {
  return (
    account.address === connectedWallet.address &&
    account.chain === connectedWallet.chain &&
    account.walletType === connectedWallet.walletType
  );
}

export function makeBalanceFor(
  retrievedBalance: WalletDetail,
  tokens: Token[]
): TokenBalance[] {
  const { blockChain: chain, balances = [] } = retrievedBalance;
  return (
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
    })) || []
  );
}

export function resetConnectedWalletState(
  connectedWallet: ConnectedWallet
): ConnectedWallet {
  return { ...connectedWallet, loading: false, error: true };
}

export const calculateWalletUsdValue = (connectedWallet: ConnectedWallet[]) => {
  const uniqueAccountAddresses = new Set<string | null>();
  const uniqueBalance: ConnectedWallet[] = connectedWallet?.reduce(
    (acc: ConnectedWallet[], current: ConnectedWallet) => {
      return acc.findIndex(
        (i) => i.address === current.address && i.chain === current.chain
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      ) === -1
        ? [...acc, current]
        : acc;
    },
    []
  );

  const modifiedWalletBlockchains = uniqueBalance?.map((chain) => {
    const modifiedWalletBlockchain: Blockchain = {
      name: chain.chain,
      accounts: [],
    };
    if (!uniqueAccountAddresses.has(chain.address)) {
      uniqueAccountAddresses.add(chain.address);
    }
    uniqueAccountAddresses.forEach((accountAddress) => {
      if (chain.address === accountAddress) {
        modifiedWalletBlockchain.accounts.push(chain);
      }
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

  return numberWithThousandSeparator(total);
};

function numberWithThousandSeparator(number: string | number): string {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

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
  return (
    cosmosExperimentalChainInfo &&
    cosmosExperimentalChainInfo[wallet]?.experimental
  );
};

export const getKeplrCompatibleConnectedWallets = (
  selectableWallets: Wallet[]
): WalletType[] => {
  const connectedWalletTypes = new Set(
    selectableWallets.map((wallet) => {
      return wallet.walletType;
    })
  );

  return KEPLR_COMPATIBLE_WALLETS.filter((compatibleWallet) =>
    connectedWalletTypes.has(compatibleWallet)
  );
};

export function formatBalance(balance: Balance | null): Balance | null {
  const formattedBalance: Balance | null = balance
    ? {
        ...balance,
        amount: numberToString(
          balance.amount,
          BALANCE_MIN_DECIMALS,
          BALANCE_MAX_DECIMALS
        ),
        usdValue: numberToString(
          balance.usdValue,
          USD_VALUE_MIN_DECIMALS,
          USD_VALUE_MAX_DECIMALS
        ),
      }
    : null;

  return formattedBalance;
}

function sortTokensByBalance(
  token1Balance: Balance | null,
  token2Balance: Balance | null
): number {
  if (token1Balance?.usdValue && token2Balance?.usdValue) {
    return (
      parseFloat(token2Balance.usdValue) - parseFloat(token1Balance.usdValue)
    );
  }

  if (!token1Balance?.usdValue && token2Balance?.usdValue) {
    return 1;
  }

  if (token1Balance?.usdValue && !token2Balance?.usdValue) {
    return -1;
  }

  if (!token1Balance?.usdValue && !token2Balance?.usdValue) {
    return (
      parseFloat(token2Balance?.amount || '0') -
      parseFloat(token1Balance?.amount || '0')
    );
  }

  return 0;
}

function sortTokensByPinnedToken(
  token1: Token,
  token2: Token,
  isTokenPinned: (token: Token) => boolean
): number {
  const isToken1Pinned = isTokenPinned(token1);
  const isToken2Pinned = isTokenPinned(token2);

  if (isToken1Pinned === isToken2Pinned) {
    return 0;
  }
  if (isToken1Pinned) {
    return -1;
  }
  return 1;
}
export function sortTokens(
  tokens: Token[],
  getBalanceFor: (token: Token) => Balance | null,
  isTokenPinned: (token: Token) => boolean
) {
  tokens.sort((token1, token2) => {
    const token1Balance = getBalanceFor(token1);
    const token2Balance = getBalanceFor(token2);
    // Check pinned tokens
    const isTokenPin = sortTokensByPinnedToken(token1, token2, isTokenPinned);

    return isTokenPin !== 0
      ? isTokenPin
      : sortTokensByBalance(token1Balance, token2Balance);
  });

  return tokens;
}

export function areTokensEqual(
  tokenA: Pick<Token, 'blockchain' | 'symbol' | 'address'> | null,
  tokenB: Pick<Token, 'blockchain' | 'symbol' | 'address'> | null
) {
  return (
    tokenA?.blockchain === tokenB?.blockchain &&
    tokenA?.symbol === tokenB?.symbol &&
    tokenA?.address === tokenB?.address
  );
}

export function sortWalletsBasedOnConnectionState(
  wallets: ModalWalletInfo[]
): ModalWalletInfo[] {
  return wallets.sort(
    (a, b) =>
      Number(b.state === WalletStatus.CONNECTED) -
        Number(a.state === WalletStatus.CONNECTED) ||
      Number(
        b.state === WalletStatus.DISCONNECTED ||
          b.state === WalletStatus.CONNECTING
      ) -
        Number(
          a.state === WalletStatus.DISCONNECTED ||
            a.state === WalletStatus.CONNECTING
        )
  );
}

export function getConciseAddress(
  address: string,
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  maxChars = 8,
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  ellipsisLength = 3
): string {
  if (address.length < 2 * maxChars + ellipsisLength) {
    return address;
  }
  const start = address.slice(0, maxChars);
  const end = address.slice(-maxChars);
  return `${start}${'.'.repeat(ellipsisLength)}${end}`;
}

export function getAddress({
  chain,
  connectedWallets,
  walletType,
}: {
  connectedWallets: ConnectedWallet[];
  walletType: string;
  chain: string;
}): string | undefined {
  return connectedWallets.find(
    (connectedWallet) =>
      connectedWallet.walletType === walletType &&
      connectedWallet.chain === chain
  )?.address;
}

export function createTokenHash(token: Asset): TokenHash {
  return `${token.blockchain}-${token.symbol}-${token.address ?? ''}`;
}

export function makeTokensBalance(connectedWallets: ConnectedWallet[]) {
  return connectedWallets
    .flatMap((wallet) => wallet.balances)
    .reduce((balances: TokensBalance, balance) => {
      const currentBalance = {
        amount: balance?.amount ?? '',
        decimals: balance?.decimal ?? 0,
        usdValue: balance?.usdPrice
          ? new BigNumber(balance?.usdPrice ?? ZERO)
              .multipliedBy(balance?.amount)
              .toString()
          : '',
      };

      const tokenHash = balance
        ? createTokenHash({
            symbol: balance.symbol,
            blockchain: balance.chain,
            address: balance.address,
          })
        : null;

      const prevBalance = tokenHash ? balances[tokenHash] : null;

      const shouldUpdateBalance =
        tokenHash &&
        (!prevBalance ||
          (prevBalance && prevBalance.amount < currentBalance.amount));

      if (shouldUpdateBalance) {
        balances[tokenHash] = currentBalance;
      }

      return balances;
    }, {});
}

export const isFetchingBalance = (
  connectedWallets: ConnectedWallet[],
  blockchain: string
) =>
  !!connectedWallets.find(
    (wallet) => wallet.chain === blockchain && wallet.loading
  );

export function hashWalletsState(walletsInfo: ModalWalletInfo[]) {
  return walletsInfo.map((w) => w.state).join('-');
}
