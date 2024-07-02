import type { BlockchainAndTokenConfig, TokenHash } from '../../types';
import type { DataSlice } from '../slices/data';
import type { Token } from 'rango-sdk';

import { createTokenHash } from '../../utils/meta';

/**
 * This function retrieves tokens and blockchains from the widget configuration and combines them with token data from the meta response to determine which tokens should be displayed in the widget.
 * To optimize performance, the function minimizes unnecessary iterations over the meta tokens.
 * The result of this function should be cached and recalculated whenever the widget configuration changes.
 */
export function calculateSupportedTokens(params: {
  type: 'source' | 'destination';
  config: {
    blockchains: BlockchainAndTokenConfig['blockchains'];
    tokens: BlockchainAndTokenConfig['tokens'];
  };
  meta: {
    tokensMapByTokenHash: DataSlice['_tokensMapByTokenHash'];
    tokensMapByBlockchainName: DataSlice['_tokensMapByBlockchainName'];
  };
}): Token[] {
  const { config, meta } = params;
  let result: Record<TokenHash, Token> = {};
  /**
   * We support two types of configurations for passing tokens in the widget config.
   * We check the type of configuration and calculate the result based on that.
   */
  if (Array.isArray(config.tokens)) {
    /**
     * If "config.tokens" is an array,
     * we iterate through it and include any token that exists in the meta data in the result.
     */
    config.tokens.forEach((token) => {
      const tokenHash = createTokenHash(token);
      const tokenFromMeta = meta.tokensMapByTokenHash.get(tokenHash);

      if (tokenFromMeta) {
        result[tokenHash] = tokenFromMeta;
      }
    });
    /**
     * From this point onward,
     * the function handles the other type of widget configuration.
     */
  } else if (!config.blockchains) {
    /**
     * If "config.blockchains" does not exist,
     * there are no limitations on the tokens, and we should include all tokens from the meta response.
     */
    result = Object.fromEntries(meta.tokensMapByTokenHash);
  } else {
    //We iterate over each blockchain and retrieve the related tokens for each one from the configuration.
    config.blockchains.forEach((blockchain) => {
      const value = !Array.isArray(config.tokens)
        ? config.tokens?.[blockchain]
        : undefined;
      /**
       * If no tokens exist for a blockchain or if the list of tokens is excluded for a blockchain,
       * we include all tokens for that blockchain from the meta response.
       */
      if (
        (!value || value?.isExcluded) &&
        meta.tokensMapByBlockchainName?.[blockchain]
      ) {
        meta.tokensMapByBlockchainName[blockchain].forEach((tokenHash) => {
          const tokenFromMeta = meta.tokensMapByTokenHash.get(tokenHash);
          if (tokenFromMeta) {
            result[tokenHash] = tokenFromMeta;
          }
        });
      }
      value?.tokens.forEach((token) => {
        const tokenHash = createTokenHash(token);
        /**
         * If tokens are excluded, we remove these excluded tokens from the previously included tokens from the meta response.
         * The remaining tokens will be included in the result.
         */
        if (value.isExcluded) {
          delete result[tokenHash];
        } else {
          //We retrieve the corresponding token from the meta and include it in the result.
          const tokenFromMeta = meta.tokensMapByTokenHash.get(tokenHash);
          if (tokenFromMeta) {
            result[tokenHash] = tokenFromMeta;
          }
        }
      });
    });
  }

  return Object.values(result);
}
