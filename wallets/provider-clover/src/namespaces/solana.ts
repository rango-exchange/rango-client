import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/solana';
import { CAIP } from '@rango-dev/wallets-core/utils';

import { changeAccountSubscriberAction } from '../actions/solana.js';
import { WALLET_ID } from '../constants.js';
import { solanaClover } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  changeAccountSubscriberAction();

const connect = builders
  .connect()
  .action(async function () {
    const solanaInstance = solanaClover();
    const solanaAccounts = await solanaInstance.getAccount();
    const result = {
      accounts: [solanaAccounts],
      chainId: LegacyNetworks.SOLANA,
    };

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
