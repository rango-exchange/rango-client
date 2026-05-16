import { defineVersions } from '@rango-dev/wallets-core/utils';

import { buildProvider } from './provider.js';

export type { Environments } from './types.js';

const versions = () =>
  defineVersions().version('1.0.0', buildProvider()).build();

export { versions };
