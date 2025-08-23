import type {
  ChangeAccountSubscriberParams,
  ProviderAPI,
  SuiActions,
} from './types.js';
import type { WalletAccount } from '@mysten/wallet-standard';

import { ActionBuilder } from '../../mod.js';
import { CAIP } from '../../utils/mod.js';
import { ChangeAccountSubscriberBuilder } from '../common/hooks/changeAccountSubscriber.js';
import {
  type CaipAccount,
  connectAndUpdateStateForSingleNetwork,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

import { CAIP_NAMESPACE, CAIP_SUI_CHAIN_ID } from './constants.js';
import { formatAccountsToCAIP, getInstanceOrThrow } from './utils.js';

// Actions
interface ConnectParams {
  name: string;
}

export const connect = (params: ConnectParams) =>
  new ActionBuilder<SuiActions, 'connect'>('connect')
    .action(async function () {
      const wallet = getInstanceOrThrow(params.name);
      const features = wallet.features;

      const result = await features['standard:connect'].connect();

      const accounts = result.accounts.map((account) => {
        return CAIP.AccountId.format({
          address: account.address,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: CAIP_SUI_CHAIN_ID,
          },
        }) as CaipAccount;
      });

      return accounts;
    })
    .and(connectAndUpdateStateForSingleNetwork)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const canEagerConnect = () =>
  new ActionBuilder<SuiActions, 'canEagerConnect'>('canEagerConnect');

// Hooks
export const changeAccountSubscriber = (
  params: ChangeAccountSubscriberParams
) =>
  new ChangeAccountSubscriberBuilder<
    { accounts: readonly WalletAccount[] },
    (() => void) | undefined,
    ProviderAPI,
    SuiActions
  >()
    .setGetInstance(() => getInstanceOrThrow(params.name))
    .setShouldItDisconnect(
      (event) =>
        /*
         * In Phantom, when user is switching to an account which is not connected to dApp yet, it returns a null.
         * So null means we don't have access to account and we 0 need to disconnect and let the user connect the account.
         */
        event.accounts?.length === 0
    )
    .setFormat(async (_, event) => formatAccountsToCAIP(event.accounts))
    .setAddEventListener((instance, callback) => {
      if (instance && callback) {
        return instance.features['standard:events'].on('change', callback);
      }
    })
    .setRemoveEventListener((_, __, unsubscribe) => {
      if (unsubscribe) {
        unsubscribe();
      }
    });
