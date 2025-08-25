import type { EvmActions, ProviderAPI } from './types.js';

import { AccountId } from 'caip';

import { ActionBuilder } from '../../mod.js';
import { ChangeAccountSubscriberBuilder } from '../common/hooks/changeAccountSubscriber.js';
import {
  connectAndUpdateStateForMultiNetworks,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

import { CAIP_NAMESPACE } from './constants.js';

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
  new ChangeAccountSubscriberBuilder<
    string[],
    undefined,
    ProviderAPI,
    EvmActions
  >()
    .setGetInstance(getInstance)
    .setValidateEventPayload(
      (accounts) =>
        /*
         * In some wallets, when a user switches to an account not yet connected to the dApp, it returns null.
         * A null value indicates no access to the account, requiring a disconnect and user reconnection.
         * This behavior may vary across different wallets, and if so, a different approach may be needed.
         */
        !accounts || accounts.length === 0
    )
    .setFormat(async (instance, accounts) => {
      const chainId = await instance.request({ method: 'eth_chainId' });
      return accounts.map((account) =>
        AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: chainId,
          },
        })
      );
    })
    .setAddEventListener((instance, callback) => {
      instance.on('accountsChanged', callback);
    })
    .setRemoveEventListener((instance, callback) => {
      if (instance && callback) {
        instance.removeListener?.('accountsChanged', callback);
      }
    });
