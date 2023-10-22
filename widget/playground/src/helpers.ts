import type { WidgetConfig } from '@rango-dev/widget-embedded';
import type { Asset, BlockchainMeta, Token } from 'rango-sdk';

import { BlockchainCategories, WalletState } from '@rango-dev/ui';
import { WalletTypes } from '@rango-dev/wallets-shared';
import { TransactionType } from 'rango-sdk';
import stringifyObject from 'stringify-object';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import subtractObject from 'subtract-object';

import { NOT_FOUND } from './constants';

export const excludedWallets = [
  WalletTypes.STATION,
  WalletTypes.LEAP,
  WalletTypes.SAFE,
  WalletTypes.MY_TON_WALLET,
  WalletTypes.WALLET_CONNECT_2,
];

export const onChangeMultiSelects = (
  value: string,
  values: any[] | undefined,
  list: any[],
  findIndex: (item: string) => boolean
): string[] | undefined => {
  if (value === 'empty') {
    return [];
  } else if (value === 'all') {
    return undefined;
  }
  if (!values) {
    values = [...list];
    const index = list.findIndex(findIndex);
    values.splice(index, 1);
    return values;
  }
  values = [...values];
  const index = values.findIndex(findIndex);
  if (index !== NOT_FOUND) {
    values.splice(index, 1);
  } else {
    values.push(value);
  }
  if (values.length === list.length) {
    return undefined;
  }
  return values;
};

export function tokensAreEqual(tokenA?: Asset, tokenB?: Asset) {
  return (
    tokenA?.blockchain === tokenB?.blockchain &&
    tokenA?.symbol === tokenB?.symbol &&
    tokenA?.address === tokenB?.address
  );
}

export const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > NOT_FOUND;

export const filterTokens = (list: Token[], searchedFor: string) =>
  list.filter(
    (token) =>
      containsText(token.symbol, searchedFor) ||
      containsText(token.address || '', searchedFor) ||
      containsText(token.name || '', searchedFor)
  );

export const syntaxHighlight = (json: string) => {
  json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g,
    function (match: string) {
      let cls = 'string';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        }
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
};

export function clearEmpties<T extends Record<string, any>>(obj: T): T {
  for (const key in obj) {
    if (!obj[key] || typeof obj[key] !== 'object') {
      continue;
    }
    clearEmpties(obj[key]);
    if (Object.keys(obj[key]).length === 0 && !Array.isArray(obj[key])) {
      delete obj[key];
    }
  }
  return obj;
}

export function filterConfig(
  WidgetConfig: WidgetConfig,
  initialConfig: WidgetConfig
) {
  const config = {
    ...WidgetConfig,
    wallets: WidgetConfig.wallets?.filter(
      (wallet) => typeof wallet === 'string'
    ),
  };

  const userSelectedConfig = clearEmpties(
    subtractObject(
      JSON.parse(JSON.stringify(initialConfig)) as WidgetConfig,
      JSON.parse(JSON.stringify(config))
    ) as WidgetConfig
  );

  const filteredConfigForExport = Object.assign({}, userSelectedConfig);

  if (!filteredConfigForExport.apiKey) {
    filteredConfigForExport.apiKey = config.apiKey;
  }

  if (!filteredConfigForExport.walletConnectProjectId) {
    filteredConfigForExport.walletConnectProjectId =
      config.walletConnectProjectId;
  }

  return { userSelectedConfig, filteredConfigForExport };
}

export function getIframeCode(config: string) {
  //TODO: update iframe script source address
  return `<div id="rango-widget-container"></div>
<script src="https://api.rango.exchange/widget/iframe.bundle.min.js"></script>
<script defer type="text/javascript">

  const config = ${insertAt(config, '  ', config.lastIndexOf('}'))}
              
  rangoWidget.init(config)
</script>
`;
}

export function getEmbeddedCode(config: string) {
  return `import { Widget, WidgetConfig } from "@rango-dev/widget-embedded";

export default function App() {

  const config = ${insertAt(config, '  ', config.lastIndexOf('}'))}
              
  return (
    <div className="App">
      <Widget config={config} />
    </div>
  );
}
`;
}

export function capitalizeTheFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function insertAt(
  originalString: string,
  insertedString: string,
  index: number
): string {
  return originalString
    .slice(0, index)
    .concat(insertedString)
    .concat(originalString.slice(index));
}

export function formatConfig(config: WidgetConfig) {
  const indentation = '    ';
  let formatedConfig: string = stringifyObject(config, {
    indent: indentation,
  });

  formatedConfig = insertAt(
    formatedConfig,
    `// This API key is only for test purpose. Don't use it in production.
    `,
    formatedConfig.indexOf('apiKey')
  );

  formatedConfig = insertAt(
    formatedConfig,
    `// This project id is only for test purpose. Don't use it in production.
    // Get your Wallet Connect project id from https://cloud.walletconnect.com/
    `,
    formatedConfig.indexOf('walletConnectProjectId')
  );

  if (!!config.wallets) {
    formatedConfig = insertAt(
      formatedConfig,
      `// You can add your external wallet to wallets
    `,
      formatedConfig.indexOf('wallets')
    );
  }

  return formatedConfig;
}

export const getStateWallet = (state: {
  connected: boolean;
  connecting: boolean;
  installed: boolean;
}): WalletState => {
  switch (true) {
    case state.connected:
      return WalletState.CONNECTED;
    case state.connecting:
      return WalletState.CONNECTING;
    case !state.installed:
      return WalletState.NOT_INSTALLED;
    default:
      return WalletState.DISCONNECTED;
  }
};

export function getCategoryNetworks(chains: BlockchainMeta[]) {
  const supportedNetworks: Set<BlockchainCategories> = new Set();

  chains.forEach((chain) => {
    switch (chain.type) {
      case TransactionType.EVM:
        supportedNetworks.add(BlockchainCategories.EVM);
        break;
      case TransactionType.COSMOS:
        supportedNetworks.add(BlockchainCategories.COSMOS);
        break;
      case TransactionType.TRANSFER:
        supportedNetworks.add(BlockchainCategories.UTXO);
        break;
      default:
        supportedNetworks.add(BlockchainCategories.OTHER);
        break;
    }
  });

  return Array.from(supportedNetworks);
}

export const tokenToString = (token: Asset) =>
  `${token.symbol}-${token.blockchain}-${token.address ?? ''}`;
