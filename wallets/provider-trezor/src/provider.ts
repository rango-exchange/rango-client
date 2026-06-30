import type { Environments } from './types.js';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm.js';

let trezorManifest: Environments['manifest'];

export const getTrezorManifest = () => trezorManifest;

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context, environments: Environments) {
      const [, setState] = context.state();

      if (!environments.manifest) {
        throw new Error('Trezor manifest is required');
      }

      trezorManifest = environments.manifest;
      setState('installed', true);
      console.debug('[trezor] instance detected.', context);
    })
    .config('metadata', metadata)
    .add('evm', evm)
    .build();

export { buildProvider };
