import type { BalanceState, ConnectedWallet } from '../store/slices/wallets';
import type {
  Balance,
  SelectedQuote,
  Wallet,
  WalletInfoWithExtra,
} from '../types';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { ExtendedWalletInfo } from '@rango-dev/wallets-react';
import type {
  Network,
  WalletState,
  WalletType,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, Token, TransactionType } from 'rango-sdk';

import {
  BlockchainCategories,
  WalletState as WalletStatus,
} from '@rango-dev/ui';
import { legacyReadAccountAddress as readAccountAddress } from '@rango-dev/wallets-core/legacy';
import {
  detectInstallLink,
  detectMobileScreens,
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

import { isBlockchainTypeInCategory, removeDuplicateFrom } from './common';
import { numberToString } from './numbers';
import { formatThousandsWithCommas } from './sanitizers';

export type ExtendedModalWalletInfo = WalletInfoWithExtra &
  Pick<ExtendedWalletInfo, 'properties' | 'isHub'>;

export function mapStatusToWalletState(state: WalletState): WalletStatus {
  if (state.connected) {
    return WalletStatus.CONNECTED;
  } else if (state.connecting) {
    return WalletStatus.CONNECTING;
  } else if (!state.installed) {
    return WalletStatus.NOT_INSTALLED;
  }
  return WalletStatus.DISCONNECTED;
}

export function mapWalletTypesToWalletInfo(
  getState: (type: WalletType) => WalletState,
  getWalletInfo: (type: WalletType) => ExtendedWalletInfo,
  list: WalletType[],
  chain?: string
): ExtendedModalWalletInfo[] {
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
      const {
        name,
        img: image,
        installLink,
        showOnMobile,
        needsNamespace,
        supportedChains,
        needsDerivationPath,
        properties,
        isHub,
        generateDeepLink,
      } = getWalletInfo(type);
      const blockchainTypes = removeDuplicateFrom(
        supportedChains.map((item) => item.type)
      );
      const state = mapStatusToWalletState(getState(type));
      return {
        title: name,
        image,
        link: detectInstallLink(installLink),
        generateDeepLink,
        canOpenDeepLink: !!generateDeepLink && detectMobileScreens(),
        state,
        type,
        showOnMobile,
        needsNamespace,
        blockchainTypes,
        needsDerivationPath,
        properties,
        isHub,
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

  function addAccount(
    network: Network,
    address: string,
    isContractWallet?: boolean
  ) {
    const accountForChainAlreadyExists = !!result.find(
      (account) => account.chain === network
    );
    if (!accountForChainAlreadyExists) {
      const newAccount: Wallet = {
        address,
        chain: network,
        walletType: wallet,
        isContractWallet: isContractWallet ?? false,
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
        addAccount(network, address.toLowerCase(), isContractWallet);
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

export function getQuoteChains(params: {
  filter: 'all' | 'required';
  quote: SelectedQuote | null;
}): string[] {
  const { filter, quote } = params;
  const wallets = new Set<string>();

  quote?.swaps.forEach((swap, swapIndex) => {
    const currentStepFromBlockchain = swap.from.blockchain;
    const currentStepToBlockchain = swap.to.blockchain;
    wallets.add(currentStepFromBlockchain);

    // Check if internalSwaps array exists
    if (swap.internalSwaps) {
      const { internalSwaps } = swap;
      internalSwaps.forEach((internalSwap, internalSwapIndex) => {
        const internalStepFromBlockchain = internalSwap.from.blockchain;
        const internalStepToBlockchain = internalSwap.to.blockchain;
        const isLastStep = swapIndex === quote.swaps.length - 1;
        const isLastInternalStep =
          internalSwapIndex === internalSwaps.length - 1;

        if (
          (!isLastStep && !isLastInternalStep) ||
          (isLastStep &&
            currentStepToBlockchain !== internalStepFromBlockchain) ||
          filter === 'all'
        ) {
          wallets.add(internalStepFromBlockchain);
        }
        if (filter === 'all') {
          wallets.add(internalStepToBlockchain);
        }
      });
    }

    if (filter === 'all') {
      wallets.add(currentStepToBlockchain);
    }
  });
  return Array.from(wallets);
}

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

export function resetConnectedWalletState(
  connectedWallet: ConnectedWallet
): ConnectedWallet {
  return { ...connectedWallet, loading: false, error: true };
}

export const calculateWalletUsdValue = (balances: BalanceState) => {
  const total = Object.values(balances).reduce((prev, balance) => {
    const usdBalance = balance.usdValue
      ? representAmountInNumber(balance.usdValue, balance.decimals)
      : ZERO.toFixed();
    return prev.plus(usdBalance);
  }, new BigNumber(ZERO));

  return numberWithThousandSeparator(total.toString());
};

function numberWithThousandSeparator(number: string | number): string {
  const parts = number.toString().split('.');
  parts[0] = formatThousandsWithCommas(parts[0]);
  return parts.join('.');
}

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

function representAmountInNumber(amount: string, decimals: number): string {
  return new BigNumber(amount).shiftedBy(-decimals).toFixed();
}

export function formatBalance(balance: Balance | null): Balance | null {
  if (!balance) {
    return null;
  }

  const amount = representAmountInNumber(balance.amount, balance.decimals);
  const usdValue = balance.usdValue
    ? representAmountInNumber(balance.usdValue, balance.decimals)
    : null;
  const formattedAmount = numberToString(
    amount,
    BALANCE_MIN_DECIMALS,
    BALANCE_MAX_DECIMALS
  );
  // null is using for detecing uknown prices
  const formattedUsdValue = usdValue
    ? numberToString(usdValue, USD_VALUE_MIN_DECIMALS, USD_VALUE_MAX_DECIMALS)
    : null;

  const formattedBalance: Balance | null = balance
    ? {
        ...balance,
        amount: formattedAmount,
        usdValue: formattedUsdValue,
      }
    : null;

  return formattedBalance;
}

export function compareTokenBalance(
  token1Balance: Balance | null,
  token2Balance: Balance | null
): number {
  if (token1Balance?.usdValue || token2Balance?.usdValue) {
    const token1UsdValue =
      !!token1Balance && !!token1Balance.usdValue
        ? new BigNumber(token1Balance.usdValue).shiftedBy(
            -token1Balance.decimals
          )
        : ZERO;
    const token2UsdValue =
      !!token2Balance && !!token2Balance.usdValue
        ? new BigNumber(token2Balance.usdValue).shiftedBy(
            -token2Balance.decimals
          )
        : ZERO;

    if (token1UsdValue.isEqualTo(token2UsdValue)) {
      return 0;
    }
    return token1UsdValue.isGreaterThan(token2UsdValue) ? -1 : 1;
  }

  if (token1Balance?.amount || token2Balance?.amount) {
    const token1Amount =
      !!token1Balance && !!token1Balance.amount
        ? new BigNumber(token1Balance.amount).shiftedBy(-token1Balance.decimals)
        : ZERO;
    const token2Amount =
      !!token2Balance && !!token2Balance.amount
        ? new BigNumber(token2Balance.amount).shiftedBy(-token2Balance.decimals)
        : ZERO;

    if (token1Amount.isEqualTo(token2Amount)) {
      return 0;
    }
    return token1Amount.isGreaterThan(token2Amount) ? -1 : 1;
  }

  return 0;
}

export function areTokensEqual(
  tokenA: Pick<Token, 'blockchain' | 'symbol' | 'address'> | null,
  tokenB: Pick<Token, 'blockchain' | 'symbol' | 'address'> | null
) {
  return (
    tokenA?.blockchain === tokenB?.blockchain &&
    tokenA?.symbol.toLowerCase() === tokenB?.symbol.toLowerCase() &&
    tokenA?.address?.toLowerCase() === tokenB?.address?.toLowerCase()
  );
}

export function sortWalletsBasedOnConnectionState(
  wallets: ExtendedModalWalletInfo[],
  state: (type: WalletType) => {
    namespaces?: Map<Namespace, { connected: boolean }>;
  }
): ExtendedModalWalletInfo[] {
  return (
    wallets
      .map((wallet) => ({
        // add isPartiallyConnected to wallet items
        isPartiallyConnected: checkIsWalletPartiallyConnected(
          wallet,
          state(wallet.type).namespaces
        ),
        ...wallet,
      }))
      .sort(
        (a, b) =>
          Number(
            b.state === WalletStatus.CONNECTED && !b.isPartiallyConnected
          ) -
            Number(
              a.state === WalletStatus.CONNECTED && !a.isPartiallyConnected
            ) ||
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
      )
      // remove isPartiallyConnected from wallet items
      .map(({ isPartiallyConnected, ...wallet }) => wallet)
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

export const isFetchingBalance = (
  connectedWallets: ConnectedWallet[],
  blockchain: string
) =>
  !!connectedWallets.find(
    (wallet) => wallet.chain === blockchain && wallet.loading
  );

export function hashWalletsState(walletsInfo: WalletInfoWithExtra[]) {
  return walletsInfo.map((w) => w.state).join('-');
}

export function filterBlockchainsByWalletTypes(
  wallets: WalletInfoWithExtra[],
  blockchains: BlockchainMeta[]
) {
  const uniqueBlockchainTypes = new Set<TransactionType>();
  wallets.forEach((wallet) => {
    wallet.blockchainTypes.forEach((type) => {
      uniqueBlockchainTypes.add(type);
    });
  });
  const filteredBlockchains = blockchains.filter((blockchain) =>
    uniqueBlockchainTypes.has(blockchain.type)
  );

  return filteredBlockchains;
}

export function filterWalletsByCategory(
  wallets: ExtendedModalWalletInfo[],
  category: string
) {
  if (category === BlockchainCategories.ALL) {
    return wallets;
  }

  return wallets.filter((wallet) => {
    for (const type of wallet.blockchainTypes) {
      if (isBlockchainTypeInCategory(type, category)) {
        return true;
      }
    }
    return false;
  });
}

export function checkIsWalletPartiallyConnected(
  wallet: ExtendedModalWalletInfo,
  namespacesState?: Map<Namespace, { connected: boolean }>
) {
  if (
    !wallet.isHub ||
    !wallet.needsNamespace ||
    wallet.state !== WalletStatus.CONNECTED
  ) {
    return false;
  }
  const namespaces = wallet.needsNamespace.data;
  const supportedNamespaces = namespaces.filter(
    (namespace) => !namespace.unsupported
  );

  return supportedNamespaces.some(
    (namespace) => !namespacesState?.get(namespace.value)?.connected
  );
}
