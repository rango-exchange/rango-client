import type { EvmActions } from '@rango-dev/wallets-core';

import { NamespaceBuilder, namespaces } from '@rango-dev/wallets-core';
import { getEvmAccounts, Networks } from '@rango-dev/wallets-shared';

import { WALLET_ID } from '../constants';
import { phantom as phantomInstance } from '../legacy/helpers';

const evm = new NamespaceBuilder<EvmActions>()
  .config('namespace', 'evm')
  .config('providerId', WALLET_ID)
  .action('init', () => {
    console.log('[phantom]init called from evm cb');
  })
  .action('connect', async function (_ctx, _chain) {
    // TODO: use chain if it's provided.
    const instance = phantomInstance();
    const evmInstance = instance?.get(Networks.ETHEREUM);

    if (!instance || !evmInstance) {
      throw new Error(
        'Are you sure Phantom injected and you have enabled evm correctly?'
      );
    }

    const result = await getEvmAccounts(evmInstance);

    console.log('you are a eth trader?', result);
    return result.accounts;
  })
  .action(namespaces.evm.actions.recommended)
  .use(namespaces.evm.and.recommended)
  .build();

namespaces.common.utils.apply('before', namespaces.evm.before.recommended, evm);
namespaces.common.utils.apply('after', namespaces.evm.after.recommended, evm);

export { evm };
