import type { BlockchainMeta } from 'rango-types';

export function getBlockchainLogo(
  blockchains: BlockchainMeta[],
  blockchainName: string
) {
  return blockchains.find((blockchain) => blockchain.name === blockchainName)
    ?.logo;
}
