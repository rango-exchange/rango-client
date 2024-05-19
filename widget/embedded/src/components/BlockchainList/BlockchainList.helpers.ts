import { type BlockchainMeta } from 'rango-sdk';

import { containsText, isBlockchainTypeInCategory } from '../../utils/common';

export const filterBlockchains = (
  list: BlockchainMeta[],
  searchedFor: string,
  blockchainCategory: string
) =>
  list
    .filter((blockchain) =>
      isBlockchainTypeInCategory(blockchain.type, blockchainCategory)
    )
    .filter(
      (blockchain) =>
        containsText(blockchain.name, searchedFor) ||
        containsText(blockchain.displayName, searchedFor)
    );
