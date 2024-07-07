import type { Tokens, WidgetConfig } from '@rango-dev/widget-embedded';
import type { Token } from 'rango-sdk';

import { initialConfig } from '../store/config';

import { areTokensEqual, shallowEqual } from './common';
import { filterConfig } from './export';

interface Configs {
  API_KEY: string;
  WC_PROJECT_ID: string;
}

/*
 * this API key is limited and
 * it is only for test purpose
 */
export const RANGO_PUBLIC_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32';
const WC_PROJECT_ID = 'e24844c5deb5193c1c14840a7af6a40b';
export const TREZOR_MANIFEST = {
  appUrl: 'https://widget.rango.exchange/',
  email: 'hi+trezorwidget@rango.exchange',
};

const configs: Configs = {
  API_KEY: RANGO_PUBLIC_API_KEY,
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
