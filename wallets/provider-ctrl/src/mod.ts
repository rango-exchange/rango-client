import { defineVersions } from '@hub3js/core/utils';

import { buildProvider } from './provider.js';

const versions = () =>
  defineVersions().version('1.0.0', buildProvider()).build();

export { versions };
