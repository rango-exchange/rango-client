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
    ProviderAPI,
    SuiActions
  >()
    .getInstance(() => getInstanceOrThrow(params.name))
    /*
     * In some wallets, when a user switches to an account not yet connected to the dApp, it returns null.
     * A null value indicates no access to the account, requiring a disconnect and user reconnection.
     */
    .onSwitchAccount((event, context) => {
      if (!event.payload.accounts?.length) {
        context.action('disconnect');
        event.preventDefault();
      }
    })
    .format(async (_, event) => formatAccountsToCAIP(event.accounts))
    .addEventListener((instance, callback) =>
      instance.features['standard:events'].on('change', callback)
    )
    .removeEventListener((_, __) => {});
