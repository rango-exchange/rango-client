import type { Environments } from './types.js';
import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { ProviderBuilder } from '@hub3js/core';

import { WalletConnectAdapter } from './adapter/adapter.js';
import { setAdapter } from './adapter/registry.js';
import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm/namespace.js';

// RPC URLs are accepted for every namespace, so any of them can start using one.
const buildProvider = (_rpcURLs: NamespacesRPCUrls) => {
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
    .add('evm', evm)
    .build();
};

export { buildProvider };
