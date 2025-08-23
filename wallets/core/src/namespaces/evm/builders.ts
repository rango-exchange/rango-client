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
  new ChangeAccountSubscriberBuilder<string[], void, ProviderAPI, EvmActions>()
    .setGetInstance(getInstance)
    .setShouldItDisconnect(
      (accounts) =>
        /*
         * In Phantom, when user is switching to an account which is not connected to dApp yet, it returns a null.
         * So null means we don't have access to account and we need to disconnect and let the user connect the account.
         *
         * This assumption may not work for other wallets, if that the case, we need to consider a new approach.
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
