import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/solana';
import { CAIP } from '@rango-dev/wallets-core/utils';
import { getSolanaAccounts } from '@rango-dev/wallets-shared';

import { WALLET_ID } from '../constants.js';
import { solanaTrustWallet } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(solanaTrustWallet);

const connect = builders
  .connect()
  .action(async function () {
    const solanaInstance = solanaTrustWallet();
    const result = await getSolanaAccounts({
      instance: solanaInstance,
      meta: [],
    });
    if (Array.isArray(result)) {
      throw new Error(
        'Expecting solana response to be a single value, not an array.'
      );
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

    return formatAccounts;
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .after(changeAccountCleanup)
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { solana };
