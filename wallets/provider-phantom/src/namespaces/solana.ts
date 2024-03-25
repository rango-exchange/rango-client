import type { SolanaActions } from '@rango-dev/wallets-core';

import {
  NamespaceBuilder,
  namespaces,
  solanaUse,
} from '@rango-dev/wallets-core';
import { getSolanaAccounts } from '@rango-dev/wallets-shared';

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
    const result = await getSolanaAccounts({
      instance,
      meta: [],
    });
    if (Array.isArray(result)) {
      throw new Error("It shouldn't be array");
    }
    console.log('you are a trader?', result);
    return result.accounts;
  })
  .use(solanaUse)
  .use([
    {
      name: 'connect',
      cb: function () {
        console.log(this);
      },
    },
  ])
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
