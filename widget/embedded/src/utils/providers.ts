import type { WidgetConfig } from '../types';
import type { ProviderInterface } from '@rango-dev/wallets-react';

import { allProviders } from '@rango-dev/provider-all';

export interface ProvidersOptions {
  walletConnectProjectId?: WidgetConfig['walletConnectProjectId'];
}

/**
 *
 * Generate a list of providers by passing a provider name (e.g. metamask) or a custom provider which implemented ProviderInterface.
 * @returns ProviderInterface[] a list of ProviderInterface
 *
 */
export function matchAndGenerateProviders(
  providers: WidgetConfig['wallets'],
  options?: ProvidersOptions
): ProviderInterface[] {
  const all = allProviders({
    walletconnect2: {
      WC_PROJECT_ID: options?.walletConnectProjectId || '',
    },
  });

  if (providers) {
    const selectedProviders: ProviderInterface[] = [];

    providers.forEach((requestedProvider) => {
      /*
       * There are two types of provider we get, the first one is only passing the wallet name
       * then we will match the wallet name with our providers (@rango-dev/provider-*).
       * The second way is passing a custom provider which implemented ProviderInterface.
       */
      if (typeof requestedProvider === 'string') {
        const result: ProviderInterface | undefined = all.find((provider) => {
          return provider.config.type === requestedProvider;
        });
        if (result) {
          selectedProviders.push(result);
        } else {
          console.warn(
            `Couldn't find ${requestedProvider} provider. Please make sure you are passing the correct name.`
          );
        }
      } else {
        // It's a custom provider so we directly push it to the list.
        selectedProviders.push(requestedProvider);
      }
    });
    return selectedProviders;
  }

  return all;
}

export function configWalletsToWalletName(
  config: WidgetConfig['wallets'],
  options?: ProvidersOptions
): string[] {
  const providers = matchAndGenerateProviders(config, options);
  const names = providers.map((provider) => {
    return provider.config.type;
  });
  return names;
}
