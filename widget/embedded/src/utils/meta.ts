import type { TokenHash } from '../types';

import {
  type Asset,
  type BlockchainMeta,
  type SwapperMeta,
  type Token,
  TransactionType,
} from 'rango-sdk';

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

export function isValidTokenAddress(
  blockchain: BlockchainMeta,
  address: string
) {
  const tokenAddressPattern = {
    [TransactionType.EVM]: /^[1-9A-HJ-NP-Za-km-z]{44}$/,
    [TransactionType.SOLANA]: /^[1-9A-HJ-NP-Za-km-z]{44}$/,
  };
  return (
    (blockchain.type === TransactionType.EVM ||
      blockchain.type === TransactionType.SOLANA) &&
    tokenAddressPattern[blockchain.type].test(address)
  );
}
