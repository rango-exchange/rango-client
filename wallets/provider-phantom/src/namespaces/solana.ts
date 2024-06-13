import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { utils } from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  after,
  and,
  before,
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/solana';
import { CAIP } from '@rango-dev/wallets-core/utils';
import { getSolanaAccounts } from '@rango-dev/wallets-shared';

import { WALLET_ID } from '../constants.js';
import { solanaPhantom } from '../legacy/helpers.js';

const solana = new NamespaceBuilder<SolanaActions>()
  .config('namespaceId', 'solana')
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

    const formatAccounts = result.accounts.map(
      (account) =>
        CAIP.AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: CAIP_SOLANA_CHAIN_ID,
          },
        }) as CaipAccount
    );

    console.log('you are a trader?', formatAccounts);
    return formatAccounts;
  })
  .action(actions.recommended)
  .subscriber(actions.changeAccountSubscriber(solanaPhantom))
  .andUse(and.recommended)
  .build();

utils.apply('before', before.recommended, solana);

utils.apply('after', after.recommended, solana);

export { solana };
