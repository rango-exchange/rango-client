import type { ProvidersOptions } from '@rango-dev/provider-all';
import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { allProviders, WalletTypes } from '@rango-dev/provider-all';

/*
 * Providers can't be serialized (e.g. from iframe), so wallets are passed by their ids and created here,
 * along with the setup of the wallets that need it.
 */
export type AppWidgetConfig = Omit<
  WidgetConfig,
  'wallets' | '__UNSTABLE_OR_INTERNAL__'
> & {
  wallets?: string[];
  walletConnectProjectId?: string;
  trezorManifest?: { appUrl: string; email: string };
  tonConnect?: { manifestUrl?: string };
  ledgerWallet?: ProvidersOptions[typeof WalletTypes.LEDGER_WALLET];
  __UNSTABLE_OR_INTERNAL__?: WidgetConfig['__UNSTABLE_OR_INTERNAL__'] & {
    walletConnectListedDesktopWalletLink?: string;
  };
};

export function toWidgetConfig(config: AppWidgetConfig): WidgetConfig {
  const {
    wallets: walletIds,
    walletConnectProjectId,
    trezorManifest,
    tonConnect,
    ledgerWallet,
    __UNSTABLE_OR_INTERNAL__: unstableOrInternal,
    ...widgetConfig
  } = config;
  const { walletConnectListedDesktopWalletLink, ...widgetUnstableOrInternal } =
    unstableOrInternal ?? {};

  const providers = allProviders({
    [WalletTypes.WALLET_CONNECT_2]: walletConnectProjectId
      ? {
          WC_PROJECT_ID: walletConnectProjectId,
          DISABLE_MODAL_AND_OPEN_LINK: walletConnectListedDesktopWalletLink,
        }
      : undefined,
    [WalletTypes.TREZOR]: trezorManifest
      ? { manifest: trezorManifest }
      : undefined,
    [WalletTypes.TON_CONNECT]: tonConnect?.manifestUrl
      ? { manifestUrl: tonConnect.manifestUrl }
      : undefined,
    [WalletTypes.LEDGER_WALLET]: ledgerWallet,
  }).map((build) => build());

  const wallets = !walletIds
    ? providers
    : walletIds.flatMap((walletId) => {
        const provider = providers.find((provider) => provider.id === walletId);
        if (!provider) {
          console.warn(
            `Couldn't find ${walletId} provider. Please make sure you are passing the correct name, and its setup if it needs one.`
          );
          return [];
        }
        return [provider];
      });

  return {
    ...widgetConfig,
    __UNSTABLE_OR_INTERNAL__: unstableOrInternal
      ? widgetUnstableOrInternal
      : undefined,
    wallets,
  };
}
