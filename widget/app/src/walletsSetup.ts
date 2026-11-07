import type { Provider } from '@hub3js/core';
import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { allProviders, WalletTypes } from '@rango-dev/provider-all';

export type WalletsSetup = {
  walletConnectProjectId?: string;
  walletConnectListedDesktopWalletLink?: string;
  trezorManifest?: { appUrl: string; email: string };
  tonConnect?: { manifestUrl?: string };
  ledgerWallet?: {
    dAppIdentifier: string;
    apiKey: string;
    loggerLevel?: 'fatal' | 'error' | 'warn' | 'info' | 'debug';
    hideButton?: boolean;
  };
};

/*
 * Config passed to the app (e.g. from iframe). Providers can't be serialized,
 * so wallets are selected by their ids and the providers are created here.
 */
export type AppWidgetConfig = Omit<
  WidgetConfig,
  'wallets' | 'walletController'
> &
  WalletsSetup & {
    wallets?: string[];
  };

const REQUIRED_SETUP_BY_WALLET: Partial<Record<string, keyof WalletsSetup>> = {
  [WalletTypes.LEDGER_WALLET]: 'ledgerWallet',
  [WalletTypes.TREZOR]: 'trezorManifest',
  [WalletTypes.TON_CONNECT]: 'tonConnect',
  [WalletTypes.WALLET_CONNECT_2]: 'walletConnectProjectId',
};

function hasRequiredSetup(walletId: string, setup: WalletsSetup) {
  const requiredKey = REQUIRED_SETUP_BY_WALLET[walletId];
  if (!requiredKey || setup[requiredKey]) {
    return true;
  }

  console.warn(
    `${walletId} is listed in config wallets but ${requiredKey} config is not provided!`
  );
  return false;
}

export function splitConfig(config: AppWidgetConfig): {
  widgetConfig: Omit<WidgetConfig, 'wallets' | 'walletController'>;
  setup: WalletsSetup;
  walletIds?: string[];
} {
  const {
    wallets: walletIds,
    walletConnectProjectId,
    walletConnectListedDesktopWalletLink,
    trezorManifest,
    tonConnect,
    ledgerWallet,
    ...widgetConfig
  } = config;
  return {
    widgetConfig,
    walletIds,
    setup: {
      walletConnectProjectId,
      walletConnectListedDesktopWalletLink:
        walletConnectListedDesktopWalletLink ??
        config.__UNSTABLE_OR_INTERNAL__?.walletConnectListedDesktopWalletLink,
      trezorManifest,
      tonConnect,
      ledgerWallet,
    },
  };
}

export function createProviders(
  setup: WalletsSetup,
  walletIds?: string[]
): Provider[] {
  const providers = allProviders()
    .map((build) => build())
    .filter((provider) => hasRequiredSetup(provider.id, setup));

  if (!walletIds) {
    return providers;
  }

  return walletIds.flatMap((walletId) => {
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
