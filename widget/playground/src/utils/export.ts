import type { WidgetConfig } from '@rango-dev/widget-embedded';

import stringifyObject from 'stringify-object';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import subtractObject from 'subtract-object';

function clearEmpties<T extends Record<string, any>>(obj: T): T {
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

function isWalletConfigNeeded(
  config: WidgetConfig,
  configKey: keyof WidgetConfig,
  walletKey: string
): boolean {
  return (
    !config[configKey] &&
    (!config.wallets || config.wallets.includes(walletKey))
  );
}

export function filterConfig(
  WidgetConfig: WidgetConfig,
  initialConfig: WidgetConfig
) {
  const config = {
    ...WidgetConfig,
    wallets: WidgetConfig.externalWallets
      ? undefined
      : WidgetConfig.wallets?.filter((wallet) => typeof wallet === 'string'),
  };

  const userSelectedConfig = clearEmpties(
    subtractObject(
      JSON.parse(JSON.stringify(initialConfig)) as WidgetConfig,
      JSON.parse(JSON.stringify(config))
    ) as WidgetConfig
  );

  const filteredConfigForExport = Object.assign({}, userSelectedConfig);

  if (filteredConfigForExport.liquiditySources?.length) {
    // When we have at least 1 item in liquidity sources, we expose excludeLiquiditySources to improve clarity and avoid bugs

    filteredConfigForExport.excludeLiquiditySources =
      config.excludeLiquiditySources === undefined
        ? true // if excludeLiquiditySources is empty, the default value for it is true
        : config.excludeLiquiditySources;
  }

  if (!filteredConfigForExport.apiKey) {
    filteredConfigForExport.apiKey = config.apiKey;
  }

  const isWalletConnectNeeded = isWalletConfigNeeded(
    filteredConfigForExport,
    'walletConnectProjectId',
    'wallet-connect-2'
  );
  if (isWalletConnectNeeded) {
    filteredConfigForExport.walletConnectProjectId =
      config.walletConnectProjectId;
  }
  const isTrezorNeeded = isWalletConfigNeeded(
    filteredConfigForExport,
    'trezorManifest',
    'trezor'
  );

  if (isTrezorNeeded) {
    filteredConfigForExport.trezorManifest = config.trezorManifest;
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

function insertAt(
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
  if (config.trezorManifest) {
    formatedConfig = insertAt(
      formatedConfig,
      `// Here, give your email and URL.
    `,
      formatedConfig.indexOf('trezorManifest')
    );
  }
  if (config.walletConnectProjectId) {
    formatedConfig = insertAt(
      formatedConfig,
      `// This project id is only for test purpose. Don't use it in production.
    // Get your Wallet Connect project id from https://cloud.walletconnect.com/
    `,
      formatedConfig.indexOf('walletConnectProjectId')
    );
  }

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
