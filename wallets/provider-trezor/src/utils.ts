import type { TrezorConnect } from '@trezor/connect-web';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { DEFAULT_ETHEREUM_RPC_URL } from '@rango-dev/signer-evm';
import { JsonRpcProvider } from 'ethers';

import { ETHEREUM_CHAIN_ID } from './constants.js';
import { getDerivationPath } from './state.js';

type DeviceAccounts = {
  accounts: string[];
  chainId: string;
  derivationPath: string;
};

/**
 * Trezor EVM is Ethereum-only today and has no injected provider, so a single
 * JSON-RPC provider over the Ethereum endpoint serves both the signer (nonce +
 * broadcast) and the read-only namespace actions (allowance, receipt).
 *
 * NOTE: If Trezor EVM support ever expands beyond Ethereum, this must select
 * the RPC per chain instead of the single Ethereum endpoint.
 */
let evmRpcProvider: JsonRpcProvider | undefined;
export function getEvmRpcProvider(): JsonRpcProvider {
  if (!evmRpcProvider) {
    evmRpcProvider = new JsonRpcProvider(DEFAULT_ETHEREUM_RPC_URL);
  }
  return evmRpcProvider;
}

// The user closed the popup, denied its permissions, or cancelled in the popup or on the device.
const TREZOR_USER_CANCELLATION_CODES = [
  'Method_Interrupted',
  'Method_PermissionsNotGranted',
  'Method_Cancel',
  'Failure_ActionCancelled',
  'Failure_PinCancelled',
];

// Trezor resolves a failed connect call instead of throwing; its `code`, not its `error` text, says whether the user cancelled.
export function toTrezorConnectionFailure(payload: {
  error: string;
  code?: string;
}): Error {
  if (payload.code && TREZOR_USER_CANCELLATION_CODES.includes(payload.code)) {
    return new WalletConnectionError(payload.error, {
      type: ConnectionErrorType.Rejected,
      cause: payload,
    });
  }
  return new Error(payload.error);
}

export const trezorErrorMessages: { [statusCode: string]: string } = {
  Failure_ActionCancelled: 'User rejected the transaction.',
};

// `@trezor/connect-web` is commonjs, when we are importing it dynamically, it has some differences in different tooling. for example vite (you can check widget-examples), goes throw error. this is a workaround for solving this interop issue.
export async function getTrezorModule() {
  const mod = await import('@trezor/connect-web');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (mod.default.default) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return mod.default.default as unknown as TrezorConnect;
  }

  return mod.default;
}

export async function getEthereumAccounts(): Promise<DeviceAccounts> {
  const TrezorConnect = await getTrezorModule();
  const derivationPath = getDerivationPath();
  const result = await TrezorConnect.ethereumGetAddress({
    path: derivationPath,
  });

  if (!result.success) {
    throw toTrezorConnectionFailure(result.payload);
  }

  return {
    accounts: [result.payload.address],
    chainId: ETHEREUM_CHAIN_ID,
    derivationPath,
  };
}

export const getTrezorNormalizedDerivationPath = (
  path: string // TrezorConnect needs master node to be added to derivation path
) => (path && !path.startsWith('m/') ? 'm/' + path : path);
