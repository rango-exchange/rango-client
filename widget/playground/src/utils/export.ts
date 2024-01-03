import type { WidgetConfig } from '@yeager-dev/widget-embedded';

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
  return `import { Widget, WidgetConfig } from "@yeager-dev/widget-embedded";

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
