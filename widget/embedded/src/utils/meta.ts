import type { Asset, BlockchainMeta, SwapperMeta, Token } from 'rango-sdk';

import { areTokensEqual } from './wallets';

export function getBlockchainDisplayNameFor(
  blockchainName: string,
  blockchains: BlockchainMeta[]
): string | undefined {
  return blockchains.find((blockchain) => blockchain.name === blockchainName)
    ?.displayName;
}
export function getBlockchainShortNameFor(
  blockchainName: string,
  blockchains: BlockchainMeta[]
): string | undefined {
  return blockchains.find((blockchain) => blockchain.name === blockchainName)
    ?.shortName;
}

export function getSwapperDisplayName(
  swapperId: string,
  swappers: SwapperMeta[]
) {
  return swappers.find((swapper) => swapper.id === swapperId)?.swapperGroup;
}

export function findToken(t: Asset, tokens: Token[]) {
  return tokens.find((token) => areTokensEqual(token, t)) ?? null;
}

export function findBlockchain(name: string, blockchains: BlockchainMeta[]) {
  return blockchains.find((blockchain) => blockchain.name === name) ?? null;
}
