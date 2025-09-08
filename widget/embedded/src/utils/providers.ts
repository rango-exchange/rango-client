import type { WidgetConfig } from '../types';
import type { Provider, VersionedProviders } from '@rango-dev/wallets-core';
import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';

import { defineVersions, pickVersion } from '@rango-dev/wallets-core';

export interface ProvidersOptions {
  walletConnectProjectId?: WidgetConfig['walletConnectProjectId'];
  walletConnectListedDesktopWalletLink?: NonNullable<
    WidgetConfig['__UNSTABLE_OR_INTERNAL__']
  >['walletConnectListedDesktopWalletLink'];
  trezorManifest: WidgetConfig['trezorManifest'];
  tonConnect: WidgetConfig['tonConnect'];
}

function isHubProvider(provider: BothProvidersInterface): provider is Provider {
  return 'version' in provider && provider.version === '1.0';
}

/**
 *
 * Generate a list of providers by passing a provider name (e.g. metamask) or a custom provider which implemented ProviderInterface.
 * @returns BothProvidersInterface[] a list of BothProvidersInterface
 *
 */
type BothProvidersInterface = LegacyProviderInterface | Provider;
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
       * The second way is passing a custom provider which implemented ProviderInterface.
       */
      if (typeof requestedWallet === 'string') {
        const result = allProviders.find((provider) => {
          /*
           * To find a provider in allProviders,
           * a version of each provider should be picked
           * and validated based on that version scheme.
           * If the corresponding provider to a wallet was found in allProvider,
           * it will be add to selected providers.
           */
          const versionedProvider =
            pickProviderVersionWithFallbackToLegacy(provider);
          if (isHubProvider(versionedProvider)) {
            return versionedProvider.id === requestedWallet;
          }
          return versionedProvider.config.type === requestedWallet;
        });

        /*
         * A provider may have multiple versions
         * (e.g., 0.0, also known as legacy, and 1.0, also known as hub).
         * We should ensure that all existing versions of a provider are added to selectedProviders.
         */
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
        if (isHubProvider(requestedWallet)) {
          selectedProviders.push(
            defineVersions().version('1.0.0', requestedWallet).build()
          );
        } else {
          selectedProviders.push(
            defineVersions().version('0.0.0', requestedWallet).build()
          );
        }
      }
    });

    return selectedProviders;
  }

  return allProviders;
}

function pickProviderVersionWithFallbackToLegacy(
  provider: VersionedProviders
): BothProvidersInterface {
  try {
    return pickVersion(provider, '1.0.0')[1];
  } catch {
    // Fallback to legacy version, if target version doesn't exists.
    return pickVersion(provider, '0.0.0')[1];
  }
}

export function configWalletsToWalletName(
  providers: VersionedProviders[]
): string[] {
  const names = providers
    .map((provider) => pickProviderVersionWithFallbackToLegacy(provider))
    .map((provider) => {
      if (isHubProvider(provider)) {
        return provider.id;
      }
      return provider.config.type;
    });
  return names;
}
