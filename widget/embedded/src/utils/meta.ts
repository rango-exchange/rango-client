import type { BlockchainMeta } from 'rango-sdk';

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
