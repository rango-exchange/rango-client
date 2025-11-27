import { defineVersions } from '@rango-dev/wallets-core/utils';

import { buildProvider } from './provider.js';

export { cosmosActions as keplrCosmosActions } from './actions/cosmos.js';
export { getCosmosAccounts as keplrGetCosmosAccounts } from './utils.js';

const versions = () =>
  defineVersions().version('1.0.0', buildProvider()).build();

export { versions };
