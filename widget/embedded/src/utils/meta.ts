import type { TokenHash } from '../types';
import type { Asset, BlockchainMeta, SwapperMeta, Token } from 'rango-sdk';

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

export function getBlockchainImage(
  blockchainName: string,
  blockchains: BlockchainMeta[]
): string | undefined {
  return blockchains.find((blockchain) => blockchain.name === blockchainName)
    ?.logo;
}

export function getSwapperDisplayName(
  swapperId: string,
  swappers: SwapperMeta[]
) {
  return swappers.find((swapper) => swapper.id === swapperId)?.title;
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

export function createTokenHash(asset: Asset): TokenHash {
  return `${asset.blockchain}-${asset.symbol}-${asset.address ?? ''}`;
}
