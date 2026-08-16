import type { TonProviderApi } from '../namespaces/ton/types.js';

import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
import { type TonActions, utils } from '@hub3js/tvm';

import { connectEventToCAIP } from '../namespaces/ton/utils.js';

/*
 * OKX emits its non-standard `accountChanged` event without a documented
 * payload, so the switched address can't be read from the event. Because the
 * bridge is standard TON Connect, `format` re-reads the active account from the
 * instance via `restoreConnection` instead
 */
export const changeAccountSubscriber = (getInstance: () => TonProviderApi) =>
  new ChangeAccountSubscriberBuilder<unknown, TonProviderApi, TonActions>()
    .getInstance(getInstance)
    .format(async (instance) => {
      try {
        const connectEvent = await instance.restoreConnection();
        return await connectEventToCAIP(connectEvent);
      } catch {
        // No active session after the switch — treat as disconnected.
        return utils.formatAccountsToCAIP([]);
      }
    })
    .addEventListener((instance, callback) => {
      instance.on('accountChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.off('accountChanged', callback);
    });

export const disconnectSubscriber = (getInstance: () => TonProviderApi) =>
  new ChangeAccountSubscriberBuilder<unknown, TonProviderApi, TonActions>()
    .getInstance(getInstance)
    .onSwitchAccount((event, context) => {
      event.preventDefault();
      void context.action('disconnect');
    })
    .format(async () => [])
    .addEventListener((instance, callback) => {
      instance.on('disconnect', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.off('disconnect', callback);
    });

export const tonBuilders = { changeAccountSubscriber, disconnectSubscriber };
