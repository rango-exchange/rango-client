import type { Environments } from './types.js';

import { defineVersions } from '@rango-dev/wallets-core/utils';

import { setEnvs } from './helpers.js';
import { buildProvider } from './provider.js';

export type { Environments } from './types.js';

const init = (environments: Environments) => setEnvs(environments);

const versions = () =>
  defineVersions().version('1.0.0', buildProvider()).build();

export { versions, init };
