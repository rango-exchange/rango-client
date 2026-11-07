import type { PlaygroundConfig } from '../store/config';

import stringifyObject from 'stringify-object';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import subtractObject from 'subtract-object';

function clearEmpties<T extends object>(obj: T): T {
  const record = obj as Record<string, unknown>;
  for (const key in record) {
    const value = record[key];
    if (!value || typeof value !== 'object') {
      continue;
    }
    clearEmpties(value);
    if (Object.keys(value).length === 0 && !Array.isArray(value)) {
      delete record[key];
    }
  }
  return obj;
}

function isWalletConfigNeeded(
  config: PlaygroundConfig,
  configKey: keyof PlaygroundConfig,
  walletKey: string
): boolean {
  return (
    !config[configKey] &&
    (!config.wallets || config.wallets.includes(walletKey))
  );
}

export function filterConfig(
  widgetConfig: PlaygroundConfig,
  initialConfig: PlaygroundConfig
) {
  const config = {
    ...widgetConfig,
    wallets: widgetConfig.externalWallets
      ? undefined
      : widgetConfig.wallets?.filter((wallet) => typeof wallet === 'string'),
  };

  const userSelectedConfig = clearEmpties(
    subtractObject(
      JSON.parse(JSON.stringify(initialConfig)) as PlaygroundConfig,
      JSON.parse(JSON.stringify(config))
    ) as PlaygroundConfig
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

  const isTonconnectNeeded = isWalletConfigNeeded(
    filteredConfigForExport,
    'tonConnect',
    'tonconnect'
  );

  if (isTonconnectNeeded) {
    filteredConfigForExport.tonConnect = config.tonConnect;
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

/*
 * Wallets are owned by your app: create the providers (e.g. with @rango-dev/provider-all)
 * and a wallet controller for them (e.g. backed by @rango-dev/wallets-react).
 * The wallet ids and wallet options below are for that setup.
 */
export default function App(props: Pick<WidgetConfig, "wallets" | "walletController">) {

  const config = ${insertAt(config, '  ', config.lastIndexOf('}'))}

  return (
    <div className="App">
      <Widget
        config={{
          ...config,
          wallets: props.wallets,
          walletController: props.walletController,
        }}
      />
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

export function formatConfig(config: PlaygroundConfig) {
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
