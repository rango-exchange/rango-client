import type { ProviderProps } from './index.js';

import { withErrorLoggingApi } from './helpers.js';
import { getHubProviders, useHubAdapter } from './hub/mod.js';

/*
 * `ProviderContext` is the public API of this package. It predates the hub and is
 * kept as-is for backward compatibility, so the hub adapter implements it.
 */
function useProviders(props: ProviderProps) {
  const { providers, ...restProps } = props;

  const api = useHubAdapter({
    ...restProps,
    providers: getHubProviders(providers),
    allVersionedProviders: providers,
  });

  return withErrorLoggingApi(api);
}

export { useProviders };
