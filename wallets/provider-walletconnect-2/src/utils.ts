import type { Chain } from '@hub3js/evm';
import type { ChainIdParams } from 'caip';
import type { BlockchainMeta } from 'rango-types';

import { isEvmBlockchain } from 'rango-types';

import { NAMESPACES } from './wcConstants.js';

const HEX_RADIX = 16;

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
