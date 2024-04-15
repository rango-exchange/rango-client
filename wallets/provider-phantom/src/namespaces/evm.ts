import type { EvmActions } from '@rango-dev/wallets-core';

import { NamespaceBuilder, namespaces } from '@rango-dev/wallets-core';

import { WALLET_ID } from '../constants';
import { evmPhantom } from '../legacy/helpers';

const evm = new NamespaceBuilder<EvmActions>()
  .config('namespace', 'evm')
  .config('providerId', WALLET_ID)
  .action('init', () => {
    console.log('[phantom]init called from evm cb');
  })
  .action([
    ...namespaces.evm.actions.recommended,
    namespaces.evm.actions.connect(evmPhantom),
  ])
  .subscriber(namespaces.evm.actions.changeAccountSubscriber(evmPhantom))
  .use(namespaces.evm.and.recommended)
  .build();

namespaces.common.utils.apply('before', namespaces.evm.before.recommended, evm);
namespaces.common.utils.apply('after', namespaces.evm.after.recommended, evm);

export { evm };
