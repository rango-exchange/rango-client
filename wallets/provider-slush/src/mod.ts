import { defineVersions } from '@arlert-dev/wallets-core/utils';

import { buildLegacyProvider } from './legacy/index.js';
import { buildProvider } from './provider.js';

const versions = () =>
  defineVersions()
    .version('0.0.0', buildLegacyProvider())
    .version('1.0.0', buildProvider())
    .build();

export { versions };
