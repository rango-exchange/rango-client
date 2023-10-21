import type { Asset, BlockchainMeta, Token } from 'rango-sdk';

import { tokensAreEqual } from './wallets';

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

export function findToken(t: Asset, tokens: Token[]) {
  return tokens.find((token) => tokensAreEqual(token, t)) ?? null;
}

export function findBlockchain(name: string, blockchains: BlockchainMeta[]) {
  return blockchains.find((blockchain) => blockchain.name === name) ?? null;
}
