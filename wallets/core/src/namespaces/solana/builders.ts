import type { ProviderAPI, SolanaActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import { ChangeAccountSubscriberBuilder } from '../common/hooks/changeAccountSubscriber.js';
import {
  connectAndUpdateStateForSingleNetwork,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

import { formatAccountsToCAIP } from './utils.js';

// Actions
export const connect = () =>
  new ActionBuilder<SolanaActions, 'connect'>('connect')
    .and(connectAndUpdateStateForSingleNetwork)
    .before(intoConnecting)
    .after(intoConnectionFinished);

// Hooks
export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<string, ProviderAPI>()
    .getInstance(getInstance)
    .validateEventPayload(
      (accounts) =>
        /*
         * In some wallets, when a user switches to an account not yet connected to the dApp, it returns null.
         * A null value indicates no access to the account, requiring a disconnect and user reconnection.
         */
        !!accounts
    )
    .format(async (_, accounts) => formatAccountsToCAIP([accounts]))
    .addEventListener((instance, callback) => {
      instance.on('accountChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.off('accountChanged', callback);
    });
