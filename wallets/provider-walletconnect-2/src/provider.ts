import type { Environments } from './types.js';
import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { WalletConnectAdapter } from './adapter/adapter.js';
import { setAdapter } from './adapter/registry.js';
import { metadata, WALLET_ID } from './constants.js';
import { buildEvm } from './namespaces/evm/namespace.js';

const buildProvider = (rpcURLs: NamespacesRPCUrls) => {
  if (!rpcURLs?.evm) {
    throw new Error('An RPC URL for the EVM namespace is required.');
  }

  return new ProviderBuilder(WALLET_ID)
    .init(function (context, environments: Environments) {
      const [, setState] = context.state();

      if (!environments.WC_PROJECT_ID) {
        throw new Error('Wallet connect project Id is required!');
      }

      setAdapter(
        new WalletConnectAdapter({
          projectId: environments.WC_PROJECT_ID,
          meta: environments.meta || [],
          disableModalLink: environments.DISABLE_MODAL_AND_OPEN_LINK,
          themeMode: environments.themeMode,
          modalZIndex: environments.modalZIndex,
        })
      );
      setState('installed', true);
      console.debug('[wallet-connect-2] provider initialized.', context);
    })
    .config('metadata', metadata)
    .add('evm', buildEvm(rpcURLs.evm))
    .build();
};

export { buildProvider };
