import type { PlaygroundConfig } from '../store/config';
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

// Providers register different namespaces, so they're typed loosely (same as `allProviders`).
type AnyProvider = ReturnType<ReturnType<typeof allProviders>[number]>;

let providers: AnyProvider[] | undefined;

/**
 * Providers are stateful, so they're built once and reused for the whole playground session.
 */
export function getProviders(): AnyProvider[] {
  if (!providers) {
    providers = allProviders().map((build) => build());
  }
  return providers;
}

export function selectProviders(
  providers: Provider[],
  config: PlaygroundConfig
): Provider[] {
  return providers.filter(
    (provider) =>
      (!config.wallets || config.wallets.includes(provider.id)) &&
      hasRequiredSetup(provider.id, config)
  );
}

export function getWalletsSetup(config: PlaygroundConfig): WalletsSetup {
  return {
    walletConnectProjectId: config.walletConnectProjectId,
    walletConnectListedDesktopWalletLink:
      config.walletConnectListedDesktopWalletLink,
    trezorManifest: config.trezorManifest,
    tonConnect: config.tonConnect,
    ledgerWallet: config.ledgerWallet,
  };
}

export function toWidgetConfig(
  config: PlaygroundConfig
): Omit<WidgetConfig, 'wallets' | 'walletController'> {
  const {
    wallets: _walletIds,
    walletConnectProjectId: _walletConnectProjectId,
    walletConnectListedDesktopWalletLink: _walletConnectListedDesktopWalletLink,
    trezorManifest: _trezorManifest,
    tonConnect: _tonConnect,
    ledgerWallet: _ledgerWallet,
    ...widgetConfig
  } = config;
  return widgetConfig;
}
