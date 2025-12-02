import type { EvmActions, ProviderAPI } from './types.js';

import { ActionBuilder } from '../../mod.js';
import { ChangeAccountSubscriberBuilder } from '../common/hooks/changeAccountSubscriber.js';
import {
  connectAndUpdateStateForMultiNetworks,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

import { formatAccountsToCAIP } from './utils.js';

// Actions
export const connect = () =>
  new ActionBuilder<EvmActions, 'connect'>('connect')
    .and(connectAndUpdateStateForMultiNetworks)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const canEagerConnect = () =>
  new ActionBuilder<EvmActions, 'canEagerConnect'>('canEagerConnect');
export const canSwitchNetwork = () =>
  new ActionBuilder<EvmActions, 'canSwitchNetwork'>('canSwitchNetwork');

// Hooks
export const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<string[], ProviderAPI, EvmActions>()
    .getInstance(getInstance)
    /*
     * In some wallets, when a user switches to an account not yet connected to the dApp, it returns null.
     * A null value indicates no access to the account, requiring a disconnect and user reconnection.
     * This behavior may vary across different wallets, and if so, a different approach may be needed.
     */
    .onSwitchAccount((event, context) => {
      if (!event.payload || !event.payload.length) {
        context.action('disconnect');
        event.preventDefault();
      }
    })
    .format(async (instance, accounts) => {
      const chainId = await instance.request({ method: 'eth_chainId' });
      return formatAccountsToCAIP(accounts, chainId);
    })
    .addEventListener((instance, callback) => {
      instance.on('accountsChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.removeListener?.('accountsChanged', callback);
    });

export const getChainId = () =>
  new ActionBuilder<EvmActions, 'getChainId'>('getChainId');
