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
  new ChangeAccountSubscriberBuilder<string, void, ProviderAPI, SolanaActions>()
    .setGetInstance(getInstance)
    .setShouldItDisconnect(
      (accounts) =>
        /*
         * In Phantom, when user is switching to an account which is not connected to dApp yet, it returns a null.
         * So null means we don't have access to account and we 0 need to disconnect and let the user connect the account.
         */
        !accounts
    )
    .setFormat(async (_, accounts) => formatAccountsToCAIP([accounts]))
    .setAddEventListener((instance, callback) => {
      instance.on('accountChanged', callback);
    })
    .setRemoveEventListener((instance, callback) => {
      if (!callback && instance) {
        instance.off('accountChanged', callback);
      }
    });
