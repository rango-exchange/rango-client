import { WalletType } from '@rango-dev/wallets-shared';
import { Asset, Token } from 'rango-sdk';
import { WidgetConfig, Theme, Support } from './types';

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

const filterObject = (object: keyof WidgetConfig) =>
  Object.fromEntries(Object.entries(object).filter(([_, value]) => !!value));

export const filterConfig = (config: WidgetConfig | Theme | Support) => {
  const copiedConfig = { ...config };
  for (const key in config) {
    if (typeof config[key] === 'object' && !Array.isArray(config[key]) && !!config[key]) {
      if (!Object.keys(filterObject(copiedConfig[key])).length) {
        copiedConfig[key] = undefined;
      } else {
        copiedConfig[key] = { ...copiedConfig[key], ...filterConfig(copiedConfig[key]) };
        if (!Object.keys(filterObject(copiedConfig[key])).length) copiedConfig[key] = undefined;
      }
    }
  }

  return copiedConfig;
};
