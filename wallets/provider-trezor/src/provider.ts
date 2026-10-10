import type { Environments } from './types.js';
import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { buildEvm } from './namespaces/evm.js';
import { utxo } from './namespaces/utxo.js';

let trezorManifest: Environments['manifest'];

export const getTrezorManifest = () => trezorManifest;

const buildProvider = (rpcURLs: NamespacesRPCUrls) => {
  if (!rpcURLs?.evm) {
    throw new Error('An RPC URL for the EVM namespace is required.');
  }

  return new ProviderBuilder(WALLET_ID)
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
    .add('evm', buildEvm(rpcURLs.evm))
    .add('utxo', utxo)
    .build();
};

export { buildProvider };
