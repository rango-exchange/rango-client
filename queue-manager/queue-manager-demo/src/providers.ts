import type { Provider } from '@hub3js/core';

import { pickVersion } from '@hub3js/core/utils';
import { allProviders } from '@rango-dev/provider-all';
import { HUB_VERSION } from '@rango-dev/wallets-react';

export const providers = allProviders().map((build) => build());

export const walletTypes = providers.map(
  (provider) => (pickVersion(provider, HUB_VERSION)[1] as Provider).id
);
