import type { WidgetConfig } from '../types';
import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';

import { allProviders } from '@rango-dev/provider-all';
import {
  defineVersions,
  pickVersion,
  Provider,
  type VersionedProviders,
} from '@rango-dev/wallets-core';

export interface ProvidersOptions {
  walletConnectProjectId?: WidgetConfig['walletConnectProjectId'];
  walletConnectListedDesktopWalletLink?: NonNullable<
    WidgetConfig['__UNSTABLE_OR_INTERNAL__']
  >['walletConnectListedDesktopWalletLink'];
  trezorManifest: WidgetConfig['trezorManifest'];
  tonConnect: WidgetConfig['tonConnect'];
  experimentalWallet?: 'enabled' | 'disabled';
}

/**
 *
 * Generate a list of providers by passing a provider name (e.g. metamask) or a custom provider which implemented ProviderInterface.
 * @returns BothProvidersInterface[] a list of BothProvidersInterface
 *
 */
type BothProvidersInterface = LegacyProviderInterface | Provider;
export function matchAndGenerateProviders(
  providers: WidgetConfig['wallets'],
  options?: ProvidersOptions
): VersionedProviders[] {
  const envs = {
    walletconnect2: {
      WC_PROJECT_ID: options?.walletConnectProjectId || '',
      DISABLE_MODAL_AND_OPEN_LINK:
        options?.walletConnectListedDesktopWalletLink,
    },
    selectedProviders: providers,
    trezor: options?.trezorManifest
      ? { manifest: options.trezorManifest }
      : undefined,
    tonConnect: options?.tonConnect?.manifestUrl
      ? { manifestUrl: options?.tonConnect.manifestUrl }
      : undefined,
  };

  const all = allProviders(envs);

  if (providers) {
    /*
     * If `wallets`  is included in widget config,
     * allProviders should be filtered based on wallets list
     */
    const selectedProviders: VersionedProviders[] = [];

    providers.forEach((requestedProvider) => {
      /*
       * There are two types of provider we get, the first one is only passing the wallet name
       * then we will match the wallet name with our providers (@rango-dev/provider-*).
       * The second way is passing a custom provider which implemented ProviderInterface.
       */
      if (typeof requestedProvider === 'string') {
        const result = all.find((provider) => {
          /*
           * To find a provider in allProviders,
           * a version of each provider should be picked
           * and validated based on that version scheme.
           * If the corresponding provider to a wallet was found in allProvider,
           * it will be add to selected providers.
           */
          const versionedProvider = pickProviderVersionWithFallbackToLegacy(
            provider,
            options
          );
          if (versionedProvider instanceof Provider) {
            return versionedProvider.id === requestedProvider;
          }
          return versionedProvider.config.type === requestedProvider;
        });

        /*
         * A provider may have multiple versions
         * (e.g., 0.0, also known as legacy, and 1.0, also known as hub).
         * We should ensure that all existing versions of a provider are added to selectedProviders.
         */
        if (result) {
          selectedProviders.push(result);
        }
        console.warn(
          // A provider name is included in config but was not found in allProviders
          `Couldn't find ${requestedProvider} provider. Please make sure you are passing the correct name.`
        );
      } else {
        // It's a custom provider so we directly push it to the list.
        if (requestedProvider instanceof Provider) {
          selectedProviders.push(
            defineVersions().version('1.0.0', requestedProvider).build()
          );
        } else {
          selectedProviders.push(
            defineVersions().version('0.0.0', requestedProvider).build()
          );
        }
      }
    });

    return selectedProviders;
  }

  return all;
}

function pickProviderVersionWithFallbackToLegacy(
  provider: VersionedProviders,
  options?: ProvidersOptions
): BothProvidersInterface {
  const { experimentalWallet = 'enabled' } = options || {};
  const version = experimentalWallet == 'disabled' ? '0.0.0' : '1.0.0';

  try {
    return pickVersion(provider, version)[1];
  } catch {
    // Fallback to legacy version, if target version doesn't exists.
    return pickVersion(provider, '0.0.0')[1];
  }
}

export function configWalletsToWalletName(
  config: WidgetConfig['wallets'],
  options?: ProvidersOptions
): string[] {
  const providers = matchAndGenerateProviders(config, options).map((provider) =>
    pickProviderVersionWithFallbackToLegacy(provider, options)
  );
  const names = providers.map((provider) => {
    if (provider instanceof Provider) {
      return provider.id;
    }
    return provider.config.type;
  });
  return names;
}
