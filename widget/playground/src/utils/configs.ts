import type { Tokens, WidgetConfig } from '@rango-dev/widget-embedded';
import type { Token } from 'rango-sdk';

import { initialConfig } from '../store/config';

import { areTokensEqual, shallowEqual } from './common';
import { getApiKeyFromEnvOrNotSet } from './env';
import { filterConfig } from './export';

interface Configs {
  API_KEY: string;
  WC_PROJECT_ID: string;
}

const WC_PROJECT_ID = 'e24844c5deb5193c1c14840a7af6a40b';
export const TREZOR_MANIFEST = {
  appUrl: 'https://widget.rango.exchange/',
  email: 'hi+trezorwidget@rango.exchange',
};
export const TON_CONNECT_MANIFEST_URL =
  'https://raw.githubusercontent.com/rango-exchange/assets/refs/heads/main/manifests/tonconnect/manifest.json';

const configs: Configs = {
  API_KEY: getApiKeyFromEnvOrNotSet(),
  WC_PROJECT_ID,
};

export function getConfig(name: keyof Configs) {
  return configs[name];
}

export type tokensConfigType =
  | {
      [blockchain: string]: Tokens;
    }
  | undefined;
export const isTokenExcludedInConfig = (
  token: Token,
  tokensConfig?: tokensConfigType
) => {
  let result = false;
  if (tokensConfig && tokensConfig[token.blockchain]) {
    result = tokensConfig[token.blockchain].tokens.some((asset) =>
      areTokensEqual(asset, token)
    );
    const isExcluded = tokensConfig[token.blockchain].isExcluded;
    return (!isExcluded && !result) || (isExcluded && result);
  }
  return result;
};

export const isConfigChanged = (widgetConfig: WidgetConfig) => {
  return !shallowEqual(
    filterConfig(initialConfig, initialConfig)?.filteredConfigForExport,
    filterConfig(widgetConfig, initialConfig)?.filteredConfigForExport
  );
};
