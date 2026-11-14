import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { allProviders, WalletTypes } from '@rango-dev/provider-all';

// Providers can't be serialized (e.g. from iframe), so wallets are passed by their ids and created here.
export type AppWidgetConfig = Omit<WidgetConfig, 'wallets'> & {
  wallets?: string[];
};

const REQUIRED_CONFIG_BY_WALLET: Partial<
  Record<string, keyof AppWidgetConfig>
> = {
  [WalletTypes.LEDGER_WALLET]: 'ledgerWallet',
  [WalletTypes.TREZOR]: 'trezorManifest',
  [WalletTypes.TON_CONNECT]: 'tonConnect',
  [WalletTypes.WALLET_CONNECT_2]: 'walletConnectProjectId',
};

function hasRequiredConfig(walletId: string, config: AppWidgetConfig) {
  const requiredKey = REQUIRED_CONFIG_BY_WALLET[walletId];
  if (!requiredKey || config[requiredKey]) {
    return true;
  }

  console.warn(
    `${walletId} is listed in config wallets but ${requiredKey} config is not provided!`
  );
  return false;
}

export function createProviders(
  config: AppWidgetConfig
): WidgetConfig['wallets'] {
  const providers = allProviders()
    .map((build) => build())
    .filter((provider) => hasRequiredConfig(provider.id, config));

  if (!config.wallets) {
    return providers;
  }

  return config.wallets.flatMap((walletId) => {
    const provider = providers.find((provider) => provider.id === walletId);
    if (!provider) {
      console.warn(
        `Couldn't find ${walletId} provider. Please make sure you are passing the correct name.`
      );
      return [];
    }
    return [provider];
  });
}
