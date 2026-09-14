import type { WidgetConfig } from '../types';

import { Provider } from '@hub3js/core';

export interface ProvidersOptions {
  walletConnectProjectId?: WidgetConfig['walletConnectProjectId'];
  walletConnectListedDesktopWalletLink?: NonNullable<
    WidgetConfig['__UNSTABLE_OR_INTERNAL__']
  >['walletConnectListedDesktopWalletLink'];
  trezorManifest: WidgetConfig['trezorManifest'];
  tonConnect: WidgetConfig['tonConnect'];
}

/**
 *
 * Generate a list of providers by passing a provider name (e.g. metamask) or a custom hub `Provider`.
 * @returns Provider[] a list of hub Providers
 *
 */
export function matchAndGenerateProviders({
  allProviders,
  configWallets,
}: {
  allProviders: Provider[];
  configWallets: WidgetConfig['wallets'];
  options?: ProvidersOptions;
}): Provider[] {
  if (configWallets) {
    /*
     * If `wallets`  is included in widget config,
     * allProviders should be filtered based on wallets list
     */
    const selectedProviders: Provider[] = [];

    configWallets.forEach((requestedWallet) => {
      /*
       * There are two types of provider we get, the first one is only passing the wallet name
       * then we will match the wallet name with our providers (@rango-dev/provider-*).
       * The second way is passing a custom hub `Provider` instance.
       */
      if (typeof requestedWallet === 'string') {
        const result = allProviders.find(
          (provider) => provider.id === requestedWallet
        );

        if (result) {
          selectedProviders.push(result);
        } else {
          console.warn(
            // A provider name is included in config but was not found in allProviders
            `Couldn't find ${requestedWallet} provider. Please make sure you are passing the correct name.`
          );
        }
      } else if (requestedWallet instanceof Provider) {
        selectedProviders.push(requestedWallet);
      } else {
        throw new Error(
          `Invalid item in widget config 'wallets': expected a wallet type string (e.g. 'metamask') or a hub 'Provider' instance, but received ${typeof requestedWallet}.`
        );
      }
    });

    return selectedProviders;
  }

  return allProviders;
}

export function configWalletsToWalletName(providers: Provider[]): string[] {
  return providers.map((provider) => provider.id);
}
