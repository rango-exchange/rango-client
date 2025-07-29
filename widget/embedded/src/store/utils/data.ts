import type {
  BlockchainAndTokenConfig,
  TokenHash,
  WidgetConfig,
} from '../../types';
import type { DataSlice } from '../slices/data';
import type { Asset, Token } from 'rango-sdk';

import { createTokenHash } from '../../utils/meta';

/**
 * This function retrieves tokens and blockchains from the widget configuration and combines them with token data from the meta response to determine which tokens should be displayed in the widget.
 * To optimize performance, the function minimizes unnecessary iterations over the meta tokens.
 * The result of this function should be cached and recalculated whenever the widget configuration changes.
 */
export function matchTokensFromConfigWithMeta(params: {
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
  const result: Record<TokenHash, Token> = {};
  const configTokens = config.tokens;

  // Helper function to add tokens to result
  const addTokens = (tokens: (Asset | TokenHash)[]) => {
    tokens.forEach((item) => {
      if (typeof item !== 'string') {
        item = createTokenHash(item);
      }
      const tokenFromMeta = meta.tokensMapByTokenHash.get(item);
      if (tokenFromMeta) {
        result[item] = tokenFromMeta;
      }
    });
  };

  /**
   * We support two types of configurations for passing tokens in the widget config.
   * We check the type of configuration and calculate the result based on that.
   */
  if (Array.isArray(configTokens)) {
    /**
     * If "config.tokens" is an array,
     * we iterate through it and include any token that exists in the meta data in the result.
     */
    if (configTokens.length > 0) {
      addTokens(configTokens);
      return Object.values(result);
    }
    return Array.from(meta.tokensMapByTokenHash.values());
  }

  /**
   * From this point onward,
   * the function handles the other type of widget configuration.
   */
  if (!configTokens) {
    return Array.from(meta.tokensMapByTokenHash.values());
  }

  let configBlockchains: string[];

  if (config.blockchains?.length) {
    configBlockchains = config.blockchains;
  } else {
    /**
     * If config.blockchains does not exist,
     * we include all tokens from every blockchain in the meta data that are not specified in the tokens from the config.
     */
    configBlockchains = Object.keys(configTokens);
    const configBlockchainsSet = new Set(configBlockchains);

    Object.keys(meta.tokensMapByBlockchainName).forEach((blockchain) => {
      const metaTokensForSelectedBlockchain =
        meta.tokensMapByBlockchainName[blockchain];
      if (
        !configBlockchainsSet.has(blockchain) &&
        metaTokensForSelectedBlockchain
      ) {
        addTokens(metaTokensForSelectedBlockchain);
      }
    });
  }
  //We iterate over each blockchain and retrieve the related tokens for each one from the configuration.
  configBlockchains.forEach((blockchain) => {
    const targetTokensForBlockchain = configTokens[blockchain];
    /**
     * If no tokens exist for a blockchain,
     * we include all tokens for that blockchain from the meta response.
     */
    if (
      !targetTokensForBlockchain &&
      meta.tokensMapByBlockchainName?.[blockchain]
    ) {
      addTokens(meta.tokensMapByBlockchainName[blockchain]);
      return;
    }

    if (targetTokensForBlockchain) {
      if (
        targetTokensForBlockchain.isExcluded &&
        meta.tokensMapByBlockchainName[blockchain]
      ) {
        /**
         * If tokens are excluded,
         * we first include all tokens from the meta for that blockchain,
         * then remove the excluded tokens from the result.
         */
        addTokens(meta.tokensMapByBlockchainName[blockchain]);
        targetTokensForBlockchain.tokens.forEach((token) => {
          const tokenHash = createTokenHash(token);
          delete result[tokenHash];
        });
      } else {
        //We retrieve the corresponding token from the meta and include it in the result.
        addTokens(targetTokensForBlockchain.tokens);
      }
    }
  });

  return Object.values(result);
}

export function getSupportedBlockchainsFromConfig(params: {
  config: WidgetConfig;
}): string[] {
  const { config } = params;
  const configFromBlockchains = config.from?.blockchains || [];
  const configToBlockchains = config.to?.blockchains || [];

  /*
   * Empty array means all blockchains. So if any of to or from has an empty array,
   * it means all blockchains is available to use and there is no limitation from config.
   */
  if (!configFromBlockchains.length || !configToBlockchains.length) {
    return [];
  }
  const blockchains = [...configFromBlockchains, ...configToBlockchains];

  const supportedBlockchains = new Set(blockchains);

  return Array.from(supportedBlockchains);
}
