import {
  getCosmosExperimentalChainInfo,
  isEvmAddress,
  KEPLR_COMPATIBLE_WALLETS,
  Network,
  WalletState,
  WalletType,
  detectInstallLink,
  WalletInfo,
  WalletTypes,
  Networks,
} from '@rango-dev/wallets-shared';

import {
  WalletInfo as ModalWalletInfo,
  WalletState as WalletStatus,
  SelectableWallet,
} from '@rango-dev/ui';
import {
  BestRouteResponse,
  BlockchainMeta,
  Token,
  WalletDetail,
} from 'rango-sdk';
import { isCosmosBlockchain } from 'rango-types';
import { readAccountAddress } from '@rango-dev/wallets-core';
import { ConnectedWallet, TokenBalance } from '../store/wallets';
import { numberToString } from './numbers';
import BigNumber from 'bignumber.js';
import { TokenWithBalance } from '../pages/SelectTokenPage';
import { ZERO } from '../constants/numbers';
import { Wallet } from '../types';

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

export const excludedWallets = [WalletTypes.LEAP];

export function getlistWallet(
  getState: (type: WalletType) => WalletState,
  getWalletInfo: (type: WalletType) => WalletInfo,
  list: WalletType[]
): ModalWalletInfo[] {
  return list
    .filter((wallet) => !excludedWallets.includes(wallet as WalletTypes))
    .map((type) => {
      const {
        name,
        img: image,
        installLink,
        showOnMobile,
      } = getWalletInfo(type);
      const state = getStateWallet(getState(type));
      return {
        name,
        image,
        installLink: detectInstallLink(installLink),
        state,
        type,
        showOnMobile: typeof showOnMobile === 'undefined' ? false : true,
      };
    });
}

export function walletAndSupportedChainsNames(
  supportedChains: BlockchainMeta[]
): Network[] | null {
  if (!supportedChains) return null;
  let walletAndSupportedChainsNames: Network[] = [];
  walletAndSupportedChainsNames = supportedChains.map(
    (blockchainMeta) => blockchainMeta.name
  );

  return walletAndSupportedChainsNames;
}

export function prepareAccountsForWalletStore(
  wallet: WalletType,
  accounts: string[],
  evmBasedChains: string[],
  supportedChainNames: Network[] | null
): Wallet[] {
  const result: Wallet[] = [];

  function addAccount(network: Network, address: string) {
    const newAccount: Wallet = {
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
    const isUnknown = network === Networks.Unknown;
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
      network === Networks.Unknown && isEvmAddress(address);
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

type Blockchain = { name: string; accounts: ConnectedWallet[] };

export function getSelectableWallets(
  connectedWallets: ConnectedWallet[],
  selectedWallets: Wallet[],
  getWalletInfo: (type: WalletType) => WalletInfo,
  destinationChain?: string
): SelectableWallet[] {
  const selectableWallets = connectedWallets.map(
    (connectedWallet: ConnectedWallet) => {
      return {
        address: connectedWallet.address,
        walletType: connectedWallet.walletType,
        chain: connectedWallet.chain,
        image: getWalletInfo(connectedWallet.walletType).img,
        name: getWalletInfo(connectedWallet.walletType).name,
        selected:
          destinationChain === connectedWallet.chain
            ? false
            : !!selectedWallets.find(
                (selectedWallet) =>
                  selectedWallet.chain === connectedWallet.chain &&
                  selectedWallet.walletType === connectedWallet.walletType
              ),
      };
    }
  );

  return selectableWallets;
}

export function getBalanceFromWallet(
  connectedWallets: ConnectedWallet[],
  chain: string,
  symbol: string,
  address: string | null
): TokenBalance | null {
  if (connectedWallets.length === 0) return null;

  const selectedChainWallets = connectedWallets.filter(
    (wallet) => wallet.chain === chain
  );
  if (selectedChainWallets.length === 0) return null;

  return (
    selectedChainWallets
      .map(
        (wallet) =>
          wallet.balances?.find(
            (balance) =>
              (address !== null && balance.address === address) ||
              (address === null &&
                balance.address === address &&
                balance.symbol === symbol)
          ) || null
      )
      .filter((balance) => balance !== null)
      .sort(
        (a, b) => parseFloat(b?.amount || '0') - parseFloat(a?.amount || '1')
      )
      .find(() => true) || null
  );
}

export function isAccountAndWalletMatched(
  account: Wallet,
  connectedWallet: ConnectedWallet
) {
  return (
    account.address === connectedWallet.address &&
    account.chain === connectedWallet.chain
  );
}

export function makeBalanceFor(
  wallet: Wallet,
  retrivedBalance: WalletDetail,
  tokens: Token[]
): ConnectedWallet {
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
    walletType: wallet.walletType,
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

export function resetConnectedWalletState(
  connectedWallet: ConnectedWallet
): ConnectedWallet {
  return { ...connectedWallet, loading: false, error: true };
}

export const calculateWalletUsdValue = (connectedWallet: ConnectedWallet[]) => {
  const uniqueAccountAddresses = new Set<string | null>();
  const uniqueBalane: ConnectedWallet[] = connectedWallet?.reduce(
    (acc: ConnectedWallet[], current: ConnectedWallet) => {
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
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export const sortTokens = (tokens: TokenWithBalance[]): TokenWithBalance[] => {
  const walletConnected = !!tokens.some((token) => token.balance);
  if (!walletConnected) {
    return tokens
      .filter((token) => !token.address)
      .concat(
        tokens.filter((token) => token.address && !token.isSecondaryCoin),
        tokens.filter((token) => token.isSecondaryCoin)
      );
  }

  return tokens
    .filter((token) => !!token.balance)
    .sort(
      (tokenA, tokenB) =>
        parseFloat(tokenB.balance?.usdValue || '0') -
        parseFloat(tokenA.balance?.usdValue || '0')
    )
    .concat(
      tokens.filter((token) => !token.balance && !token.isSecondaryCoin),
      tokens.filter((token) => !token.balance && token.isSecondaryCoin)
    );
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
    selectableWallets.map((wallet) => {
      return wallet.walletType;
    })
  );

  return KEPLR_COMPATIBLE_WALLETS.filter((compatibleWallet) =>
    connectedWalletTypes.has(compatibleWallet)
  );
};

export function getTokensWithBalance(
  tokens: TokenWithBalance[],
  connectedWallets: ConnectedWallet[]
): TokenWithBalance[] {
  return tokens.map(({ balance, ...otherProps }) => {
    const tokenAmount = numberToString(
      new BigNumber(
        getBalanceFromWallet(
          connectedWallets,
          otherProps.blockchain,
          otherProps.symbol,
          otherProps.address
        )?.amount || ZERO
      )
    );

    let tokenUsdValue = '';
    if (otherProps.usdPrice)
      tokenUsdValue = numberToString(
        new BigNumber(
          getBalanceFromWallet(
            connectedWallets,
            otherProps.blockchain,
            otherProps.symbol,
            otherProps.address
          )?.amount || ZERO
        ).multipliedBy(otherProps.usdPrice)
      );

    return {
      ...otherProps,
      ...(tokenAmount !== '0' && {
        balance: { amount: tokenAmount, usdValue: tokenUsdValue },
      }),
    };
  });
}

export function getSortedTokens(
  chain: BlockchainMeta | null,
  tokens: Token[],
  connectedWallets: ConnectedWallet[],
  otherChainTokens: TokenWithBalance[]
): TokenWithBalance[] {
  const fromChainEqueulsToToChain = chain?.name === otherChainTokens[0]?.name;
  if (fromChainEqueulsToToChain) return otherChainTokens;
  const filteredTokens = tokens.filter(
    (token) => token.blockchain === chain?.name
  );
  return sortTokens(getTokensWithBalance(filteredTokens, connectedWallets));
}

export function tokensAreEqual(
  tokenA: Pick<Token, 'blockchain' | 'symbol' | 'address'> | null,
  tokenB: Pick<Token, 'blockchain' | 'symbol' | 'address'> | null
) {
  return (
    tokenA?.blockchain === tokenB?.blockchain &&
    tokenA?.symbol === tokenB?.symbol &&
    tokenA?.address === tokenB?.address
  );
}

export function getDefaultToken(
  sortedTokens: TokenWithBalance[],
  otherToken: TokenWithBalance | null
): TokenWithBalance {
  let selectedToken: TokenWithBalance;
  const firstToken = sortedTokens[0];
  const secondToken = sortedTokens[1];
  if (sortedTokens.length === 1) selectedToken = firstToken;
  else if (tokensAreEqual(firstToken, otherToken)) selectedToken = secondToken;
  else selectedToken = firstToken;
  return selectedToken;
}

export function sortWalletsBasedOnState(
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
