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
  return swappers.find((swapper) => swapper.id === swapperId)?.title;
}

export function findToken(t: Asset, tokens: Token[]) {
  return tokens.find((token) => areTokensEqual(token, t)) ?? null;
}

export function findBlockchain(name: string, blockchains: BlockchainMeta[]) {
  return blockchains.find((blockchain) => blockchain.name === name) ?? null;
}

export function isTokenNative(
  token: Token,
  blockchain: BlockchainMeta | undefined
) {
  if (!blockchain || !token) {
    return false;
  }

  for (const feeAsset of blockchain.feeAssets) {
    if (
      token?.blockchain === feeAsset?.blockchain &&
      token?.symbol === feeAsset?.symbol &&
      token?.address === feeAsset?.address
    ) {
      return true;
    }
  }

  return false;
}
