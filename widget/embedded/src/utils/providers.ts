import type { WidgetConfig } from '../types';

import { Provider } from '@hub3js/core';
import {
  defineVersions,
  pickVersion,
  type VersionedProviders,
} from '@hub3js/core/utils';
import { HUB_VERSION } from '@rango-dev/wallets-react';

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
 * @returns VersionedProviders[] a list of VersionedProviders
 *
 */
export function matchAndGenerateProviders({
  allProviders,
  configWallets,
}: {
  allProviders: VersionedProviders[];
  configWallets: WidgetConfig['wallets'];
  options?: ProvidersOptions;
}): VersionedProviders[] {
  if (configWallets) {
    /*
     * If `wallets`  is included in widget config,
     * allProviders should be filtered based on wallets list
     */
    const selectedProviders: VersionedProviders[] = [];

    configWallets.forEach((requestedWallet) => {
      /*
       * There are two types of provider we get, the first one is only passing the wallet name
       * then we will match the wallet name with our providers (@rango-dev/provider-*).
       * The second way is passing a custom hub `Provider` instance.
       */
      if (typeof requestedWallet === 'string') {
        const result = allProviders.find(
          (provider) => pickProviderVersion(provider).id === requestedWallet
        );

        if (result) {
          selectedProviders.push(result);
        } else {
          console.warn(
            // A provider name is included in config but was not found in allProviders
            `Couldn't find ${requestedWallet} provider. Please make sure you are passing the correct name.`
          );
        }
      } else {
        // It's a custom provider so we directly push it to the list.
        if (!(requestedWallet instanceof Provider)) {
          throw new Error(
            `Legacy providers aren't supported anymore. Pass a hub 'Provider' instance in 'wallets' instead.`
          );
        }

        selectedProviders.push(
          defineVersions().version(HUB_VERSION, requestedWallet).build()
        );
      }
    });

    return selectedProviders;
  }

  return allProviders;
}

export function pickProviderVersion(provider: VersionedProviders): Provider {
  return pickVersion(provider, HUB_VERSION)[1] as Provider;
}

export function configWalletsToWalletName(
  providers: VersionedProviders[]
): string[] {
  return providers.map((provider) => pickProviderVersion(provider).id);
}
