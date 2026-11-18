import type { Environments } from './types.js';

import { ProviderBuilder } from '@hub3js/core';

import { WalletConnectAdapter } from './adapter/adapter.js';
import { setAdapter } from './adapter/registry.js';
import { metadata, WALLET_ID } from './constants.js';
import { evm } from './namespaces/evm/namespace.js';

const buildProvider = (environments: Environments) =>
  new ProviderBuilder(WALLET_ID)
    // The blockchain meta is only known at runtime, so it's passed at init.
    .init(function (context, runtime?: Pick<Environments, 'meta'>) {
      const [, setState] = context.state();

      if (!environments.WC_PROJECT_ID) {
        throw new Error('Wallet connect project Id is required!');
      }

      setAdapter(
        new WalletConnectAdapter({
          projectId: environments.WC_PROJECT_ID,
          meta: runtime?.meta || environments.meta || [],
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

export { buildProvider };
