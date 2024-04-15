import type { SolanaActions } from '@rango-dev/wallets-core';

import { CAIP, NamespaceBuilder, namespaces } from '@rango-dev/wallets-core';
import { getSolanaAccounts } from '@rango-dev/wallets-shared';

import { WALLET_ID } from '../constants';
import { solanaPhantom } from '../legacy/helpers';

const solana = new NamespaceBuilder<SolanaActions>()
  .config('namespace', 'solana')
  .config('providerId', WALLET_ID)
  .action('init', () => {
    console.log('[phantom]init called from solana cb');
  })
  .action('connect', async function () {
    const solanaInstance = solanaPhantom();

    const result = await getSolanaAccounts({
      instance: solanaInstance,
      meta: [],
    });
    if (Array.isArray(result)) {
      throw new Error("It shouldn't be array");
    }

    const formatAccounts = result.accounts.map((account) =>
      CAIP.AccountId.format({
        address: account,
        // TODO: export from core
        chainId: {
          namespace: 'solana',
          reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
        },
      })
    );

    console.log('you are a trader?', formatAccounts);
    return formatAccounts;
  })
  .action(namespaces.solana.actions.recommended)
  .subscriber(namespaces.solana.actions.changeAccountSubscriber(solanaPhantom))
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
