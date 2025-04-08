import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/solana';
import { CAIP } from '@rango-dev/wallets-core/utils';

import { WALLET_ID } from '../constants.js';
import { evmCoinbase, getSolanaAccounts, solanaCoinbase } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(solanaCoinbase);

const connect = builders
  .connect()
  .action(async function () {
    const solanaInstance = solanaCoinbase();
    const result = await getSolanaAccounts(solanaInstance);

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
/*
 * Coinbase does not provide an eager connection mechanism for its Solana wallet.
 * The only workaround is to use the EVM-based eager connect approach.
 * However, this will only work if the EVM namespace has been connected at least once before.
 * If either wallet instance is unavailable, we throw an error.
 */
export const canEagerConnectAction = async () => {
  const evmInstance = evmCoinbase();
  const solanaInstance = solanaCoinbase();
  // Making sure that the Solana instance is available first to prevent errors.
  if (!solanaInstance) {
    throw new Error(
      'Trying to eagerly connect to your wallet, but seems its solana instance is not available.'
    );
  }
  if (!evmInstance) {
    throw new Error(
      'Trying to eagerly connect to your EVM wallet, but seems its instance is not available.'
    );
  }

  try {
    const accounts: string[] = await evmInstance.request({
      method: 'eth_accounts',
    });
    if (accounts.length) {
      return true;
    }
    return false;
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
