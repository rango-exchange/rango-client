import type { ProviderProps } from './index.js';

import { withErrorLoggingApi } from './helpers.js';
import { getHubProviders, useHubAdapter } from './hub/mod.js';

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
