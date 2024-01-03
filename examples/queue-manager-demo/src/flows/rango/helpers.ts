/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import type {
  APIErrorCode,
  BestRoute,
  Blockchain,
  CheckTxStatusRequest,
  CreateTransactionRequest,
  CreateTransactionResponse,
  ErrorDetail,
  RawAccounts,
  SwapperStatusResponse,
  SwapSavedSettings,
  TokenMeta,
  TransactionName,
  UserWalletBlockchain,
  WalletTypeAndAddress,
} from './types';
import type {
  AllBlockchains,
  Network,
  WalletType,
} from '@yeager-dev/wallets-shared';
import type { BestRouteRequest } from 'rango-sdk';
import type { CheckApprovalResponse } from 'rango-sdk-basic';
import type {
  EvmBlockchainMeta,
  PendingSwap,
  PendingSwapStep,
} from 'rango-types';

import { SUPPORTED_ETH_CHAINS as XDEFI_WALLET_SUPPORTED_EVM_CHAINS } from '@yeager-dev/provider-xdefi/src/constants';
import { readAccountAddress } from '@yeager-dev/wallets-react';
import {
  Networks,
  WalletTypes,
  XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
} from '@yeager-dev/wallets-shared';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import {
  isCosmosBlockchain,
  isEvmBlockchain,
  isSolanaBlockchain,
  SignerError,
} from 'rango-types';

import { sampleRawAccounts } from './mock';
import {
  ApiMethodName,
  EXODUS_WALLET_SUPPORTED_CHAINS,
  NETWORK_TO_NATIVE_SYMBOL_MAP_FOR_1INCH,
  NETWORKS_FOR_1INCH,
  OKX_WALLET_SUPPORTED_CHAINS,
  SWAPPER_ONE_INCH_LIST,
} from './types';

const UNKNOWN_COIN_IMAGE = '/coins/unknown.png';
const BRAVE_USER_AGENT_HEADER = 'X-Brave';
const url = 'https://api.rango.exchange';

export const BASE_URL = url;
export const RANGO_COOKIE_HEADER = 'X-Rango-Id';
export const RANGO_DAPP_ID_QUERY =
  'apiKey=4a624ab5-16ff-4f96-90b7-ab00ddfc342c';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const navigator: any;

export function calculatePendingSwap(
  inputAmount: string,
  bestRoute: BestRoute,
  wallets: { [p: string]: WalletTypeAndAddress },
  settings: SwapSavedSettings,
  validateBalanceOrFee: boolean
): PendingSwap {
  const simulationResult = bestRoute.result;
  if (!simulationResult) {
    throw Error('Simulation result should not be null');
  }

  return {
    creationTime: new Date().getTime().toString(),
    finishTime: null,
    requestId: bestRoute.requestId || '',
    inputAmount: inputAmount,
    wallets,
    status: 'running',
    isPaused: false,
    extraMessage: null,
    extraMessageSeverity: null,
    extraMessageDetail: null,
    extraMessageErrorCode: null,
    networkStatusExtraMessage: null,
    networkStatusExtraMessageDetail: null,
    lastNotificationTime: null,
    settings: settings,
    simulationResult: simulationResult,
    validateBalanceOrFee,
    steps:
      bestRoute.result?.swaps?.map((s, i) => ({
        id: i + 1,
        fromBlockchain: s.from.blockchain,
        fromSymbol: s.from.symbol,
        fromSymbolAddress:
          NETWORKS_FOR_1INCH.includes(s.from.blockchain as Networks) &&
          SWAPPER_ONE_INCH_LIST.includes(s.swapperId) &&
          (!s.from.address || s.from.address.length === 0)
            ? null
            : s.from.address,
        fromDecimals: s.from.decimals,
        fromAmountPrecision: s.fromAmountPrecision,
        fromAmountMinValue: s.fromAmountMinValue,
        fromAmountMaxValue: s.fromAmountMaxValue,
        toBlockchain: s.to.blockchain,
        fromLogo: s.from.logo,
        toSymbol: s.to.symbol,
        toSymbolAddress:
          NETWORKS_FOR_1INCH.includes(s.to.blockchain as Networks) &&
          SWAPPER_ONE_INCH_LIST.includes(s.swapperId) &&
          NETWORK_TO_NATIVE_SYMBOL_MAP_FOR_1INCH.get(
            s.to.blockchain as Networks
          ) === s.to.symbol &&
          (!s.to.address || s.to.address.length === 0)
            ? null
            : s.to.address,
        toDecimals: s.to.decimals,
        toLogo: s.to.logo,
        startTransactionTime: new Date().getTime(),
        swapperId: s.swapperId,
        expectedOutputAmountHumanReadable: s.toAmount,
        outputAmount: null,
        status: 'created',
        networkStatus: null,
        executedTransactionId: null,
        externalTransactionId: null,
        explorerUrl: null,
        trackingCode: null,
        cosmosTransaction: null,
        solanaTransaction: null,
        evmTransaction: null,
        evmApprovalTransaction: null,
        transferTransaction: null,
        diagnosisUrl: null,
        internalSteps: null,
      })) || [],
  };
}

export function getCookieId(): string {
  const key = 'X-Rango-Id';
  const cookieId = window.localStorage.getItem(key);
  if (cookieId) {
    return cookieId;
  }
  const value =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  window.localStorage.setItem(key, value);
  return value;
}

export const getBestRoute = async (
  from: TokenMeta,
  to: TokenMeta,
  amount: BigNumber,
  rawAccounts: RawAccounts,
  checkPrerequisites: boolean,
  signal: AbortSignal | undefined,
  selectedWallets?: { [p: string]: string },
  swappersGroupsBlackList?: string[],
  blockchainsWhiteList?: Network[]
): Promise<BestRoute | null> => {
  const connectedWallets: UserWalletBlockchain[] = (
    rawAccounts?.blockchains || []
  ).map((b) => ({
    blockchain: b.name,
    addresses: Array.from(new Set(b.accounts.map((a) => a.address))),
  }));

  const body: BestRouteRequest = {
    from: {
      blockchain: from.blockchain,
      symbol: from.symbol,
      address: from.address,
    },
    to: { blockchain: to.blockchain, symbol: to.symbol, address: to.address },
    amount: amount.toString(),
    connectedWallets,
    selectedWallets: selectedWallets || {},
    checkPrerequisites: checkPrerequisites,
    affiliateRef: localStorage.getItem('affiliateRef'),
    swapperGroups: swappersGroupsBlackList,
    ...(!!swappersGroupsBlackList && { swappersGroupsExclude: true }),
    blockchains: blockchainsWhiteList,
  };
  const url = `${BASE_URL}/routing/best?${RANGO_DAPP_ID_QUERY}`;

  let isBrave: boolean;
  try {
    isBrave = navigator.brave && (await navigator.brave.isBrave());
  } catch (error) {
    isBrave = false;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      [RANGO_COOKIE_HEADER]: getCookieId(),
      ...(isBrave && { [BRAVE_USER_AGENT_HEADER]: 'true' }),
    },
    body: JSON.stringify(body),
    signal,
  });
  const res = await response.json();
  if (res?.status === 500 || res?.error) {
    throw new Error(res?.error || `Error from server, status: ${res.status}`);
  }
  return res;
};

export const urlToToken = (s: string | null): TokenMeta | null => {
  if (!s) {
    return null;
  }

  const ps1 = s.split('--');
  const ps2 = ps1[0].split('.');

  return {
    // symbol: ps2[1], // this doesnt work for USDT.E (on avax) AVAX.WETH.E--0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab
    symbol: ps2.slice(1).join('.'),
    image: UNKNOWN_COIN_IMAGE,
    blockchain: ps2[0] as Networks,
    address: ps1.length === 2 ? decodeURIComponent(ps1[1]) : null,
    usdPrice: null,
    isSecondaryCoin: false,
    coinSource: null,
    name: null,
    coinSourceUrl: null,
    decimals: 18,
  };
};

export async function checkApproved(
  requestId: string
): Promise<CheckApprovalResponse> {
  const url = `${BASE_URL}/tx/${requestId}/check-approval?${RANGO_DAPP_ID_QUERY}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      [RANGO_COOKIE_HEADER]: getCookieId(),
    },
  });

  if (
    (!!response.status && (response.status < 200 || response.status >= 400)) ||
    !response.ok
  ) {
    const apiError = ERROR_COMMUNICATING_WITH_API(ApiMethodName.CheckApproval);
    throw PrettyError.BadStatusCode(apiError, response.status);
  }

  return await response.json();
}

export async function checkSwapStatus(
  requestId: string,
  txId: string,
  step: number
): Promise<SwapperStatusResponse | null> {
  const url = `${BASE_URL}/tx/check-status?${RANGO_DAPP_ID_QUERY}`;
  const body: CheckTxStatusRequest = { step, txId, requestId };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      [RANGO_COOKIE_HEADER]: getCookieId(),
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(body),
  });

  if (
    (!!response.status && (response.status < 200 || response.status >= 400)) ||
    !response.ok
  ) {
    const apiError = ERROR_COMMUNICATING_WITH_API(
      ApiMethodName.CheckingTransactionStatus
    );
    throw PrettyError.BadStatusCode(apiError, response.status);
  }

  const res = await response.json();
  return {
    ...res,
    outputAmount: res.outputAmount ? new BigNumber(res.outputAmount) : null,
  };
}

export const ERROR_ASSERTION_FAILED = 'Assertion failed (Unexpected behaviour)';

export const ERROR_COMMUNICATING_WITH_API = (apiMethodName: ApiMethodName) =>
  `Unexpected response from API (${apiMethodName})`;

export const ERROR_DESCRIPTION_UNSUPPORTED_TRANSACTION = (
  method: string,
  walletType: WalletType
) => `method: ${method} call is unsupported for wallet ${walletType}`;

export const ERROR_SIGNING_TRANSACTION = (transactionName: TransactionName) =>
  `Error sending ${transactionName}`;
export const ERROR_REJECTING_TRANSACTION = 'User rejected the message signing';

export const ERROR_CREATE_TRANSACTION =
  'Create transaction failed in Rango Server';
export const ERROR_INPUT_WALLET_NOT_FOUND = 'Input wallet not found';

export const DEFAULT_WALLET_INJECTION_ERROR =
  'Failed to connect to wallet, if you have turned injection off (disable default wallet for xDefi), turn it on and refresh the page';

export class PrettyError extends Error {
  private readonly detail?: string;
  private readonly root?: any;
  private readonly code?: APIErrorCode;

  constructor(code: APIErrorCode, m: string, root?: any, detail?: string) {
    super(m);
    Object.setPrototypeOf(this, PrettyError.prototype);
    this.code = code;
    this.detail = detail;
    this.root = root;
  }

  getErrorDetail(): ErrorDetail {
    const rawMessage =
      typeof this.root === 'object' && this.root && this.root.error
        ? this.root.error
        : JSON.stringify(this.root);
    const rootStr =
      typeof this.root === 'string'
        ? this.root
        : this.root instanceof Error
        ? this.root.message
        : rawMessage;
    return {
      extraMessage: this.message,
      extraMessageDetail: this.detail || rootStr,
      extraMessageErrorCode: this.code || null,
    };
  }

  static AssertionFailed(m: string): PrettyError {
    return new PrettyError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      ERROR_ASSERTION_FAILED,
      m
    );
  }

  static BadStatusCode(
    message: string,
    statusCode: number | string
  ): PrettyError {
    return new PrettyError(
      'TX_FAIL',
      message,
      null,
      `status code = ${statusCode}`
    );
  }

  static CreateTransaction(detail: string): PrettyError {
    return new PrettyError(
      'FETCH_TX_FAILED',
      ERROR_CREATE_TRANSACTION,
      null,
      detail
    );
  }

  static WalletMissing(): PrettyError {
    return new PrettyError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      ERROR_INPUT_WALLET_NOT_FOUND,
      null,
      'Server requested for a blockchain or address not selected by user'
    );
  }

  static BlockchainMissing(): PrettyError {
    return new PrettyError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      ERROR_INPUT_WALLET_NOT_FOUND,
      null,
      'Server requested for a blockchain or address not selected by user'
    );
  }
}

export function getNextStep(
  swap: PendingSwap,
  currentStep: PendingSwapStep
): PendingSwapStep | null {
  return (
    swap.steps.find(
      (step) =>
        step.status !== 'failed' &&
        step.status !== 'success' &&
        step.id !== currentStep.id
    ) || null
  );
}

export async function createTransaction(
  request: CreateTransactionRequest
): Promise<CreateTransactionResponse> {
  const url = `${BASE_URL}/tx/create?${RANGO_DAPP_ID_QUERY}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        [RANGO_COOKIE_HEADER]: getCookieId(),
      },
      body: JSON.stringify(request),
    });

    if (
      (!!response.status &&
        (response.status < 200 || response.status >= 400)) ||
      !response.ok
    ) {
      throw PrettyError.CreateTransaction(
        `Error creating the transaction, status code: ${response.status}`
      );
    }

    const result: CreateTransactionResponse = await response.json();
    if (!result.ok || !result.transaction) {
      throw PrettyError.CreateTransaction(
        result.error || 'bad response from create tx endpoint'
      );
    }

    return result;
  } catch (error: any) {
    throw PrettyError.CreateTransaction(error.message);
  }
}

export const prettifyErrorMessage = (obj: unknown): ErrorDetail => {
  if (!obj) {
    return { extraMessage: '', extraMessageErrorCode: null };
  }
  if (obj instanceof PrettyError) {
    return obj.getErrorDetail();
  }
  if (obj instanceof SignerError) {
    const t = obj.getErrorDetail();
    return {
      extraMessage: t.message,
      extraMessageDetail: t.detail,
      extraMessageErrorCode: t.code,
    };
  }
  if (obj instanceof Error) {
    return {
      extraMessage: obj.toString(),
      extraMessageErrorCode: null,
    };
  }
  if (typeof obj !== 'string') {
    return {
      extraMessage: JSON.stringify(obj),
      extraMessageErrorCode: null,
    };
  }
  return { extraMessage: obj, extraMessageErrorCode: null };
};

export const getEvmApproveUrl = (
  tx: string,
  network: Network,
  evmBasedBlockchains: EvmBlockchainMeta[]
): string => {
  const evmBlochain = evmBasedBlockchains.find(
    (blockchain) => blockchain.name === network
  );

  if (!evmBlochain) {
    throw Error(`unsupported network: ${network} for getting approve url.`);
  }

  if (evmBlochain.info.transactionUrl) {
    return evmBlochain.info.transactionUrl.replace(
      '{txHash}',
      tx.toLowerCase()
    );
  }

  throw Error(`Explorer url for ${network} is not implemented`);
};

export const getCurrentBlockchainOfOrNull = (
  swap: PendingSwap,
  step: PendingSwapStep
): Network | null => {
  try {
    return getCurrentBlockchainOf(swap, step);
  } catch (e) {
    return null;
  }
};

export const getCurrentBlockchainOf = (
  swap: PendingSwap,
  step: PendingSwapStep
): Network => {
  const b1 =
    step.evmTransaction?.blockChain ||
    step.evmApprovalTransaction?.blockChain ||
    step.cosmosTransaction?.blockChain ||
    step.solanaTransaction?.blockChain;
  if (b1) {
    return b1;
  }

  const transferAddress = step.transferTransaction?.fromWalletAddress;
  if (!transferAddress) {
    throw PrettyError.BlockchainMissing();
  }

  const blockchain =
    Object.keys(swap.wallets).find(
      (b) => swap.wallets[b]?.address === transferAddress
    ) || null;
  if (blockchain == null) {
    throw PrettyError.BlockchainMissing();
  }

  // TODO: check why it returns string
  return blockchain;
};

export interface ConvertToFullAccountInfo {
  evmBasedChainsNames: string[];
  supportedChainsByWallets: { [type in WalletType]?: Network[] } | null;
}
export function convertRawAccountToFullAccount(
  wallet: WalletType,
  accounts: string[],
  connectedNetwork: Network | null,
  info: ConvertToFullAccountInfo
): Blockchain[] {
  const { evmBasedChainsNames: evmBasedChains, supportedChainsByWallets } =
    info;
  const result = {} as { [type in Network]: Blockchain };

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

    if (result[network]) {
      result[network].accounts.push(newAccount);
    } else {
      result[network] = {
        name: network,
        accounts: [newAccount],
      };
    }
  }

  const supportedChains = supportedChainsByWallets?.[wallet] || [];

  accounts.forEach((account) => {
    const { address, network } = readAccountAddress(account);

    const hasLimitation = supportedChains.length > 0;
    const isSupported = supportedChains.includes(network);
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
     * Example: showing our evm compatible netwrok when the uknown network is evem.
     * Otherwise, we stop executing this function.
     */
    const isUknownAndEvmBased =
      network === Networks.Unknown && ethers.utils.isAddress(address);
    if (isUnknown && !isUknownAndEvmBased) {
      return;
    }

    const isEvmBasedChain = evmBasedChains.includes(network);

    // If it's an evm network, we will add the address to all the evm chains.
    if (isEvmBasedChain || isUknownAndEvmBased) {
      /*
       * all evm chains are not supported in wallets, so we are adding
       * only to those that are supported by wallet.
       */
      const evmChainsSupportedByWallet = supportedChains.filter((chain) =>
        evmBasedChains.includes(chain)
      );

      evmChainsSupportedByWallet.forEach((network) => {
        /*
         * EVM addresses are not case sensetive.
         * Some wallets like Binance-chain return some letters in uppercase which produces bugs in our wallet state.
         */
        addAccount(network, address.toLowerCase());
      });
    } else {
      addAccount(network, address);
    }
  });

  return Object.values(result);
}

export const evmBasedChainsNamesSelector = (blockchains: AllBlockchains) =>
  Object.entries(blockchains)
    .map(([, blockchainMeta]) => blockchainMeta)
    .filter(isEvmBlockchain)
    .map((blockchainMeta) => blockchainMeta.name);

export const walletsAndSupportedChainsMetaSelector = (
  blockchains: AllBlockchains
): any | null => {
  // TODO WalletsAndSupportedChains can't find model for return type
  if (Object.entries(blockchains).length === 0) {
    return null;
  }
  const blockchainsArray = Object.entries(blockchains).map(
    ([, blockchainMeta]) => blockchainMeta
  );
  const evmBlockchains = blockchainsArray.filter(isEvmBlockchain);
  const solanaBlockchain = blockchainsArray.filter(isSolanaBlockchain);
  const cosmosBlockchains = blockchainsArray.filter(isCosmosBlockchain);
  return {
    [WalletTypes.META_MASK]: evmBlockchains,
    [WalletTypes.COINBASE]: [...evmBlockchains, ...solanaBlockchain],
    [WalletTypes.KEPLR]: cosmosBlockchains.filter(
      (blockchainMeta) => !!blockchainMeta.info
    ),
    [WalletTypes.PHANTOM]: solanaBlockchain,
    [WalletTypes.XDEFI]: blockchainsArray.filter((blockchainMeta) =>
      [
        ...XDEFI_WALLET_SUPPORTED_EVM_CHAINS,
        ...XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
        Networks.SOLANA,
      ].includes(blockchainMeta.name as Networks)
    ),
    [WalletTypes.TRUST_WALLET]: evmBlockchains,
    [WalletTypes.COIN98]: [...evmBlockchains, ...solanaBlockchain],
    [WalletTypes.OKX]: blockchainsArray.filter((blockchainMeta) =>
      OKX_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Networks)
    ),

    [WalletTypes.EXODUS]: blockchainsArray.filter((blockchainMeta) =>
      EXODUS_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Networks)
    ),

    [WalletTypes.TOKEN_POCKET]: evmBlockchains,
    [WalletTypes.STATION]: [],
    [WalletTypes.LEAP]: [],
    [WalletTypes.MATH]: [...evmBlockchains, ...solanaBlockchain],
    [WalletTypes.SAFEPAL]: [
      ...evmBlockchains,
      ...solanaBlockchain,
      /*
       * ...blockchainsArray.filter((blockchainMeta) =>
       *   SAFEPAL_SUPPORTED_NATIVE_CHAINS.includes(blockchainMeta.name),
       * ),
       */
    ],
    [WalletTypes.CLOVER]: [...evmBlockchains, ...solanaBlockchain],
    [WalletTypes.COSMOSTATION]: [
      ...evmBlockchains,
      ...cosmosBlockchains.filter((blockchainMeta) => !!blockchainMeta.info),
    ],
    [WalletTypes.BRAVE]: [...evmBlockchains, ...solanaBlockchain],
  };
};

export const walletsAndSupportedChainsNamesSelector = (blockchains: any) => {
  const walletsAndSupportedChainsMeta =
    walletsAndSupportedChainsMetaSelector(blockchains);
  if (!walletsAndSupportedChainsMeta) {
    return null;
  }
  const walletsAndSupportedChainsNames: {
    [type: WalletType]: Network[] | undefined;
  } = {};
  for (const key in walletsAndSupportedChainsMeta) {
    walletsAndSupportedChainsNames[key] = walletsAndSupportedChainsMeta[
      key
    ].map((blockchainMeta: { name: any }) => blockchainMeta.name);
  }
  return walletsAndSupportedChainsNames;
};

export async function requestSwap(
  input: string,
  from: TokenMeta,
  to: TokenMeta
) {
  const inputAmount = input;
  const amount = new BigNumber(inputAmount);
  const rawAccounts = sampleRawAccounts;
  const checkPrerequisites = true;
  const signal = undefined;
  const selectedWallets = {
    BSC: '0x2702d89c1c8658b49c45dd460deebcc45faec03c',
    POLYGON: '0x2702d89c1c8658b49c45dd460deebcc45faec03c',
    FANTOM: '0x2702d89c1c8658b49c45dd460deebcc45faec03c',
    AVAX_CCHAIN: '0x2702d89c1c8658b49c45dd460deebcc45faec03c',
    COSMOS: 'cosmos1unf2rcytjxfpz8x8ar63h4qeftadptg5r5qswd',
  };
  const swappersGroupsBlackList: string[] | undefined = [];
  const blockchainsWhiteList: string[] | undefined = [];

  const bestRoute = await getBestRoute(
    from,
    to,
    amount,
    rawAccounts,
    checkPrerequisites,
    signal,
    selectedWallets,
    swappersGroupsBlackList,
    blockchainsWhiteList
  );

  if (!bestRoute) {
    throw 'No route found.';
  }

  const settings = {
    slippage: '1.0',
    disabledSwappersIds: [],
    disabledSwappersGroups: [],
  };
  const wallets: { [p: string]: WalletTypeAndAddress } = {};
  if (rawAccounts) {
    rawAccounts.blockchains.forEach((item) => {
      // We know there is only one account.
      wallets[item.name] = item.accounts[0];
    });
  }

  const newSwap: PendingSwap = calculatePendingSwap(
    inputAmount,
    bestRoute,
    wallets,
    settings,
    false
  );

  return newSwap;
}

export function logRPCError(
  error: unknown,
  swap: PendingSwap,
  currentStep: PendingSwapStep | undefined,
  walletType: WalletType | undefined
) {
  try {
    // Sending to sentry
  } catch (e) {
    console.log({ e });
  }
}
