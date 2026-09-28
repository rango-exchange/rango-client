import type { Chain } from '@hub3js/evm';
import type { ChainIdParams } from 'caip';
import type { BlockchainMeta } from 'rango-types';

import { ConnectionErrorType, isUserRejectionError } from '@hub3js/std/utils';
import { getSdkError } from '@walletconnect/utils';
import { isEvmBlockchain } from 'rango-types';

import { NAMESPACES } from './wcConstants.js';

const HEX_RADIX = 16;

// The documented codes a wallet answers a session proposal with when the user rejects it.
const WALLETCONNECT_REJECTION_CODES = [
  getSdkError('USER_REJECTED').code,
  getSdkError('USER_REJECTED_METHODS').code,
];

export function classifyWalletConnectConnectionError(
  error: unknown
): ConnectionErrorType {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    WALLETCONNECT_REJECTION_CODES.some((code) => code === error.code)
  ) {
    return ConnectionErrorType.Rejected;
  }
  return isUserRejectionError(error)
    ? ConnectionErrorType.Rejected
    : ConnectionErrorType.Unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function timeout<T = any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forPromise: Promise<any>,
  time: number
): Promise<T> {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject('Timeout!');
    }, time);
  });

  return Promise.race([forPromise, timeoutPromise]);
}

export function utf8ToHex(value: string, prefixed = false): string {
  const hex = Array.from(new TextEncoder().encode(value))
    .map((byte) => byte.toString(HEX_RADIX).padStart(2, '0'))
    .join('');

  return prefixed ? `0x${hex}` : hex;
}

/** Normalizes hub chain input (hex, decimal, or AddEthereumChainParameter) to a decimal reference. */
export function parseChainReference(
  chain?: string | Chain
): string | undefined {
  if (!chain) {
    return undefined;
  }

  if (typeof chain === 'string') {
    return chain.startsWith('0x')
      ? String(parseInt(chain))
      : String(parseInt(chain, 10) || chain);
  }

  return String(parseInt(chain.chainId));
}

/** Maps a chain reference to a Rango network name using blockchain meta. */
export function resolveNetworkName(
  chain: string | Chain | null | undefined,
  meta: BlockchainMeta[]
): string | undefined {
  const reference = parseChainReference(chain ?? undefined);
  if (!reference) {
    return undefined;
  }

  return meta.find(
    (blockchain) =>
      isEvmBlockchain(blockchain) &&
      String(parseInt(blockchain.chainId)) === reference
  )?.name;
}

/** Converts a decimal EVM chain reference to the `0x`-prefixed hex expected by hub EVM actions. */
export function chainReferenceToHex(reference: string): `0x${string}` {
  return `0x${parseInt(reference).toString(HEX_RADIX)}`;
}

/**
 * Converts rango EVM blockchain meta to CAIP-2 chain ids - the only chain data the
 * connect/proposal path needs. This is the single boundary where rango-types' chain
 * shape is translated; everything downstream uses caip's ChainIdParams.
 */
export function evmMetaToCaipChainIds(meta: BlockchainMeta[]): ChainIdParams[] {
  return meta.filter(isEvmBlockchain).map((blockchain) => ({
    namespace: NAMESPACES.ETHEREUM,
    reference: String(parseInt(blockchain.chainId)),
  }));
}
