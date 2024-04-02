import type { WidgetConfig } from '../types';
import type { V1, Versions, VLegacy } from '@rango-dev/wallets-core';

import { allProviders } from '@rango-dev/provider-all';
import { defineVersions, pickVersion } from '@rango-dev/wallets-core';
import { Core } from '@rango-dev/wallets-react';

export interface ProvidersOptions {
  walletConnectProjectId?: WidgetConfig['walletConnectProjectId'];
  experimentalWallet?: 'enabled' | 'disabled';
}

/**
 *
 * Generate a list of providers by passing a provider name (e.g. metamask) or a custom provider which implemented ProviderInterface.
 * @returns BothProvidersInterface[] a list of BothProvidersInterface
 *
 */
type BothProvidersInterface = VLegacy | V1;
export function matchAndGenerateProviders(
  providers: WidgetConfig['wallets'],
  options?: ProvidersOptions
): Versions[] {
  const { walletConnectProjectId = '', experimentalWallet = 'disabled' } =
    options || {};
  const envs = {
    walletconnect2: {
      WC_PROJECT_ID: walletConnectProjectId,
    },
  };
  console.log({
    experimentalWallet,
    options,
    allProvidersRaw: allProviders(envs),
  });

  const all = allProviders(envs);

  console.log({ all });

  if (providers) {
    const selectedProviders: Versions[] = [];

    providers.forEach((requestedProvider) => {
      /*
       * There are two types of provider we get, the first one is only passing the wallet name
       * then we will match the wallet name with our providers (@rango-dev/provider-*).
       * The second way is passing a custom provider which implemented ProviderInterface.
       */
      if (typeof requestedProvider === 'string') {
        const result: BothProvidersInterface | undefined =
          pickVersionWithFallbackToLegacy(all, options).find((provider) => {
            if (provider instanceof Core.Provider) {
              return provider.id === requestedProvider;
            }
            return provider.config.type === requestedProvider;
          });

        // TODO: refactor these conditions.
        if (result) {
          if (result instanceof Core.Provider) {
            selectedProviders.push(
              defineVersions().version('1.0.0', result).build()
            );
          } else {
            selectedProviders.push(
              defineVersions().version('0.0.0', result).build()
            );
          }
        } else {
          console.warn(
            `Couldn't find ${requestedProvider} provider. Please make sure you are passing the correct name.`
          );
        }
      } else {
        // It's a custom provider so we directly push it to the list.
        if (requestedProvider instanceof Core.Provider) {
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

// TODO: this is a duplication with what we do in core.
function pickVersionWithFallbackToLegacy(
  p: Versions[],
  options?: ProvidersOptions
): BothProvidersInterface[] {
  const { experimentalWallet = 'disabled' } = options || {};

  return p.map((provider) => {
    const version = experimentalWallet == 'disabled' ? '0.0.0' : '1.0.0';
    try {
      return pickVersion(provider, version)[1];
    } catch {
      // Fallback to legacy version, if target version doesn't exists.
      return pickVersion(provider, '0.0.0')[1];
    }
  });
}

export function configWalletsToWalletName(
  config: WidgetConfig['wallets'],
  options?: ProvidersOptions
): string[] {
  const providers = pickVersionWithFallbackToLegacy(
    matchAndGenerateProviders(config, options),
    options
  );
  const names = providers.map((provider) => {
    if (provider instanceof Core.Provider) {
      return provider.id;
    }
    return provider.config.type;
  });
  return names;
}
