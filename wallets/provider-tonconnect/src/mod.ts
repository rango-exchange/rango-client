import type { Environments } from './types.js';

import { defineVersions } from '@rango-dev/wallets-core/utils';

import { buildProvider } from './provider.js';
import { setEnvs } from './utils.js';

export type { Environments } from './types.js';

const init = (environments: Environments) => setEnvs(environments);

const versions = () =>
  defineVersions().version('1.0.0', buildProvider()).build();

export { versions, init };
