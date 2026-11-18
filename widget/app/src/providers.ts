import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { allProviders, WalletTypes } from '@rango-dev/provider-all';

// Providers can't be serialized (e.g. from iframe), so wallets are passed by their ids and created here.
export type AppWidgetConfig = Omit<WidgetConfig, 'wallets'> & {
  wallets?: string[];
};

export function createProviders(
  config: AppWidgetConfig
): WidgetConfig['wallets'] {
  const providers = allProviders({
    [WalletTypes.WALLET_CONNECT_2]: config.walletConnectProjectId
      ? {
          WC_PROJECT_ID: config.walletConnectProjectId,
          DISABLE_MODAL_AND_OPEN_LINK:
            config.__UNSTABLE_OR_INTERNAL__
              ?.walletConnectListedDesktopWalletLink,
        }
      : undefined,
    [WalletTypes.TREZOR]: config.trezorManifest
      ? { manifest: config.trezorManifest }
      : undefined,
    [WalletTypes.TON_CONNECT]: config.tonConnect?.manifestUrl
      ? { manifestUrl: config.tonConnect.manifestUrl }
      : undefined,
    [WalletTypes.LEDGER_WALLET]: config.ledgerWallet,
  }).map((build) => build());

  if (!config.wallets) {
    return providers;
  }

  return config.wallets.flatMap((walletId) => {
    const provider = providers.find((provider) => provider.id === walletId);
    if (!provider) {
      console.warn(
        `Couldn't find ${walletId} provider. Please make sure you are passing the correct name, and its setup if it needs one.`
      );
      return [];
    }
    return [provider];
  });
}
