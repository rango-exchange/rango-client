import type { CaipAccount } from '@arlert-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@arlert-dev/wallets-core/namespaces/solana';

import { ActionBuilder, NamespaceBuilder } from '@arlert-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@arlert-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
} from '@arlert-dev/wallets-core/namespaces/solana';
import { CAIP } from '@arlert-dev/wallets-core/utils';
import { getSolanaAccounts } from '@arlert-dev/wallets-shared';

import { WALLET_ID } from '../constants.js';
import { solanaPhantom } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(solanaPhantom);

/*
 * TODO: If user imported a private key for EVM, it hasn't solana.
 * when trying to connect to solana for this user we go through `-32603` which is an internal error.
 * If phantom added an specific error code for this situation, we can consider handling the error here.
 * @see https://docs.phantom.app/solana/errors
 */
const connect = builders
  .connect()
  .action(async function () {
    const solanaInstance = solanaPhantom();
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
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .after(changeAccountCleanup)
  .build();

export const canEagerConnectAction = async () => {
  const solanaInstance = solanaPhantom();

  if (!solanaInstance) {
    throw new Error(
      'Trying to eagerly connect to your Solana wallet, but seems its instance is not available.'
    );
  }

  try {
    const result = await solanaInstance.connect({ onlyIfTrusted: true });
    return !!result;
  } catch {
    return false;
  }
};

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(canEagerConnectAction)
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { solana };
