import type { Tokens } from '../types';
import type { Asset, BlockchainMeta, Token } from 'rango-sdk';

import { RANGO_PUBLIC_API_KEY } from '../constants';

import { areTokensEqual } from './wallets';

export interface Configs {
  API_KEY: string;
  BASE_URL?: string;
}

type TokensConfig =
  | Asset[]
  | {
      [blockchain: string]: Tokens;
    };

let configs: Configs = {
  API_KEY: RANGO_PUBLIC_API_KEY,
};

export function getConfig(name: keyof Configs) {
  return configs[name] || '';
}

export function setConfig(name: keyof Configs, value: any) {
  configs[name] = value;

  return value;
}

/**
 * Getting new configs from params and reset the value of global `configs` with provided param.
 */
export function initConfig(nextConfigs: Configs) {
  let clonedConfigs;
  if (typeof structuredClone === 'function') {
    clonedConfigs = structuredClone(nextConfigs);
  } else {
    clonedConfigs = JSON.parse(JSON.stringify(nextConfigs));
  }
  configs = clonedConfigs;
  return configs;
}

export const DEFAULT_PRIMARY_RADIUS = 20;
export const DEFAULT_SECONDARY_RADIUS = 25;
export const DEFAULT_FONT_FAMILY = 'Roboto';

export const THEME_CLASS_NAME_PREFIX = `theme-widget`;

export const isTokenExcludedInConfig = (
  token: Token | null,
  tokensConfig?: TokensConfig
) => {
  let result = false;
  if (tokensConfig && token) {
    if (Array.isArray(tokensConfig)) {
      result = !tokensConfig.some((asset) => areTokensEqual(asset, token));
    } else if (!Array.isArray(tokensConfig) && tokensConfig[token.blockchain]) {
      result = tokensConfig[token.blockchain].tokens.some((asset) =>
        areTokensEqual(asset, token)
      );
      const isExcluded = tokensConfig[token.blockchain].isExcluded;
      return (!isExcluded && !result) || (isExcluded && result);
    }
  }
  return result;
};

export const isBlockchainExcludedInConfig = (
  blockchain: BlockchainMeta | null,
  blockchainsConfig?: string[]
) => {
  return (
    blockchain &&
    blockchainsConfig &&
    !blockchainsConfig.includes(blockchain.name)
  );
};
