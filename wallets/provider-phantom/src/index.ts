import { defineVersions } from '@rango-dev/wallets-core';

import { v0 } from './legacy';
import { provider as v1 } from './provider';

const versions = defineVersions()
  .version('0.0.0', v0)
  .version('1.0.0', v1)
  .build();

export { versions };
