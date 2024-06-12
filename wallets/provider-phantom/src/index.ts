import { defineVersions } from '@rango-dev/wallets-core/utils';

import { v0 } from './legacy/index.js';
import { provider as v1 } from './provider.js';

const versions = defineVersions()
  .version('0.0.0', v0)
  .version('1.0.0', v1)
  .build();

export { versions };
