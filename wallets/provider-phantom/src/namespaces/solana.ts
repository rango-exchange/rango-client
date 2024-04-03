import type { SolanaActions } from '@rango-dev/wallets-core';

import { NamespaceBuilder, namespaces } from '@rango-dev/wallets-core';
import { getSolanaAccounts, Networks } from '@rango-dev/wallets-shared';

import { WALLET_ID } from '../constants';
import { phantom as phantomInstance } from '../legacy/helpers';

const solana = new NamespaceBuilder<SolanaActions>()
  .config('namespace', 'solana')
  .config('providerId', WALLET_ID)
  .action('init', () => {
    console.log('[phantom]init called from solana cb');
  })
  .action('connect', async function () {
    const instance = phantomInstance();
    const solanaInstance = instance?.get(Networks.SOLANA);

    if (!instance || !solanaInstance) {
      throw new Error(
        'Are you sure Phantom injected and you have enabled solana correctly?'
      );
    }

    const result = await getSolanaAccounts({
      instance: solanaInstance,
      meta: [],
    });
    if (Array.isArray(result)) {
      throw new Error("It shouldn't be array");
    }
    console.log('you are a trader?', result);
    return result.accounts;
  })
  .action(namespaces.solana.actions.recommended)
  .use(namespaces.solana.and.recommended)
  .build();

namespaces.common.utils.apply(
  'before',
  namespaces.solana.before.recommended,
  solana
);

namespaces.common.utils.apply(
  'after',
  namespaces.solana.after.recommended,
  solana
);

export { solana };
