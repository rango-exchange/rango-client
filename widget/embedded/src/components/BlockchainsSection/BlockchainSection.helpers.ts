import type { BlockchainMeta } from 'rango-sdk';

export const sortBlockchains = (blockchains: BlockchainMeta[]) => {
  const importantBlockchains: BlockchainMeta[] = [];
  const otherBlockchains: BlockchainMeta[] = [];

  for (const blockchain of blockchains) {
    if (
      blockchain.name === 'ETH' ||
      blockchain.name === 'COSMOS' ||
      blockchain.name === 'OSMOSIS'
    ) {
      importantBlockchains.push(blockchain);
    } else {
      otherBlockchains.push(blockchain);
    }
  }

  return importantBlockchains.concat(otherBlockchains);
};
