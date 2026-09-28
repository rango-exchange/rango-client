import type Transport from '@ledgerhq/hw-transport';

import { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';
import { CAIP_SOLANA_CHAIN_ID } from '@hub3js/solana';
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { getAltStatusMessage } from '@ledgerhq/errors';
import { DEFAULT_ETHEREUM_RPC_URL } from '@rango-dev/signer-evm';
import bs58 from 'bs58';
import { JsonRpcProvider } from 'ethers';

import { ETHEREUM_CHAIN_ID, HEXADECIMAL_BASE } from './constants.js';
import { getDerivationPath } from './state.js';

export type Provider = Map<string, unknown>;

/**
 * Ledger EVM is Ethereum-only today and has no injected provider, so a single
 * JSON-RPC provider over the Ethereum endpoint serves both the signer (nonce +
 * broadcast) and the read-only namespace actions (allowance, receipt).
 *
 * NOTE: If Ledger EVM support ever expands beyond Ethereum, this must select
 * the RPC per chain instead of the single Ethereum endpoint.
 */
let evmRpcProvider: JsonRpcProvider | undefined;
export function getEvmRpcProvider(): JsonRpcProvider {
  if (!evmRpcProvider) {
    evmRpcProvider = new JsonRpcProvider(DEFAULT_ETHEREUM_RPC_URL);
  }
  return evmRpcProvider;
}

type DeviceAccounts = {
  accounts: string[];
  chainId: string;
  derivationPath: string;
};

export function ledger(): Provider | null {
  /*
   * Instances have a required property which is `chainId` and is using in swap execution.
   * Here we are setting it as Ethereum always since we are supporting only eth for now.
   */
  const instances = new Map();

  instances.set(EVM_NAMESPACE, { chainId: ETHEREUM_CHAIN_ID });
  instances.set(SOLANA_NAMESPACE, { chainId: CAIP_SOLANA_CHAIN_ID });

  return instances;
}

const LedgerStatusCode = {
  LockedDevice: 0x5515,
  AppNotReady: 0x650f,
  ActionDenied: 0x6985,
} as const;

const ledgerFrequentErrorMessages: { [statusCode: number]: string } = {
  [LedgerStatusCode.LockedDevice]: 'The device is locked',
  [LedgerStatusCode.AppNotReady]:
    'Related application is not ready on your device',
  [LedgerStatusCode.ActionDenied]: 'Action denied by user',
};

function getLedgerErrorMessage(statusCode: number): string {
  if (ledgerFrequentErrorMessages[statusCode]) {
    return ledgerFrequentErrorMessages[statusCode];
  } else if (getAltStatusMessage(statusCode)) {
    return getAltStatusMessage(statusCode) as string;
  }

  return `Ledger device unknown error 0x${statusCode.toString(
    HEXADECIMAL_BASE
  )}`; // Hexadecimal numbers are more commonly recognized and utilized for representing ledger error codes
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLedgerError(error: any) {
  if (error?.statusCode) {
    return new Error(getLedgerErrorMessage(error.statusCode));
  }

  if (error?.code === 'INSUFFICIENT_FUNDS') {
    return new Error('Insufficient funds for transaction');
  }
  return error;
}

const LEDGER_USER_CANCELLED_ERROR_NAME = 'TransportOpenUserCancelled';

function getStatusCode(error: unknown): number | undefined {
  if (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
  ) {
    return error.statusCode;
  }
  return undefined;
}

// Reads the device status rather than the message `getLedgerError` flattens it into, and the error's name rather than `instanceof`.
export function classifyLedgerConnectionError(
  error: unknown
): ConnectionErrorType {
  const statusCode = getStatusCode(error);
  if (statusCode === LedgerStatusCode.LockedDevice) {
    return ConnectionErrorType.Locked;
  }
  if (statusCode === LedgerStatusCode.ActionDenied) {
    return ConnectionErrorType.Rejected;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === LEDGER_USER_CANCELLED_ERROR_NAME
  ) {
    return ConnectionErrorType.Rejected;
  }
  return isUserRejectionError(error)
    ? ConnectionErrorType.Rejected
    : ConnectionErrorType.Unknown;
}

export function toLedgerConnectionError(error: unknown): WalletConnectionError {
  const type = classifyLedgerConnectionError(error);
  const statusCode = getStatusCode(error);
  const message =
    statusCode === undefined
      ? getErrorMessage(error) ?? CONNECTION_ERROR_MESSAGES[type]
      : getLedgerErrorMessage(statusCode);
  return new WalletConnectionError(message, { type, cause: error });
}

export async function getEthereumAccounts(): Promise<DeviceAccounts> {
  try {
    const transport = await transportConnect();
    const LedgerAppEth = (await import('@ledgerhq/hw-app-eth')).default;
    const eth = new LedgerAppEth(transport);
    const derivationPath = getDerivationPath();

    const accounts: string[] = [];

    const result = await eth.getAddress(derivationPath, false, true);
    accounts.push(result.address);

    return {
      accounts: accounts,
      chainId: ETHEREUM_CHAIN_ID,
      derivationPath,
    };
  } finally {
    await transportDisconnect();
  }
}

export async function getSolanaAccounts(): Promise<DeviceAccounts> {
  try {
    const transport = await transportConnect();
    const LedgerAppSolana = (await import('@ledgerhq/hw-app-solana')).default;
    const solana = new LedgerAppSolana(transport);
    const derivationPath = getDerivationPath();

    const accounts: string[] = [];

    const result = await solana.getAddress(derivationPath);
    accounts.push(bs58.encode(result.address));

    return {
      accounts: accounts,
      chainId: CAIP_SOLANA_CHAIN_ID,
      derivationPath,
    };
  } finally {
    await transportDisconnect();
  }
}

let transportConnection: Transport | null = null;

export async function transportConnect() {
  const TransportWebHID = (await import('@ledgerhq/hw-transport-webhid'))
    .default;

  transportConnection = await TransportWebHID.create();

  return transportConnection;
}

export async function transportDisconnect() {
  if (transportConnection) {
    await transportConnection.close();
    transportConnection = null;
  }
}
