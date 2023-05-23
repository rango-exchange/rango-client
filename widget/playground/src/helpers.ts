import { WalletType } from '@rango-dev/wallets-shared';
import { Asset, Token } from 'rango-sdk';
import { WidgetConfig } from './types';
import subtractObject from 'subtract-object';

export const excludedWallets = [WalletType.UNKNOWN, WalletType.STATION, WalletType.LEAP];

export const onChangeMultiSelects = (value, values, list, findIndex) => {
  if (value === 'empty') return [];
  else if (value === 'all') return null;
  if (!values) {
    values = [...list];
    const index = list.findIndex(findIndex);
    values.splice(index, 1);
    return values;
  } else {
    values = [...values];
    const index = values.findIndex(findIndex);
    if (index !== -1) values.splice(index, 1);
    else values.push(value);
    if (values.length === list.length) return undefined;
    else return values;
  }
};

export function tokensAreEqual(tokenA?: Asset, tokenB?: Asset) {
  return (
    tokenA?.blockchain === tokenB?.blockchain &&
    tokenA?.symbol === tokenB?.symbol &&
    tokenA?.address === tokenB?.address
  );
}

export const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

export const filterTokens = (list: Token[], searchedFor: string) =>
  list.filter(
    (token) =>
      containsText(token.symbol, searchedFor) ||
      containsText(token.address || '', searchedFor) ||
      containsText(token.name || '', searchedFor),
  );

export const syntaxHighlight = (json) => {
  json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = 'string';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        }
      }
      return `<span class="${cls}">${match}</span>`;
    },
  );
};

export function clearEmpties<T extends Record<string, any>>(obj: T): T {
  for (const key in obj) {
    if (!obj[key] || typeof obj[key] !== 'object') {
      continue;
    }
    clearEmpties(obj[key]);
    if ((Array.isArray(obj[key]) && !obj[key].length) || Object.keys(obj[key]).length === 0) {
      delete obj[key];
    }
  }
  return obj;
}

export function filterConfig(
  config: WidgetConfig,
  initialConfig: WidgetConfig,
): Partial<WidgetConfig> {
  const userSelectedConfig = clearEmpties(subtractObject(initialConfig, config));

  if (!userSelectedConfig.apiKey) userSelectedConfig.apiKey = config.apiKey;

  return userSelectedConfig;
}
