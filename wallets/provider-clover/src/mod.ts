import { defineVersions } from '@rango-dev/wallets-core/utils';

import { legacyProvider } from './legacy/index.js';
import { provider } from './provider.js';

const versions = defineVersions()
  .version('0.0.0', legacyProvider)
  .version('1.0.0', provider)
  .build();

export { versions };
