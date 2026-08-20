import type { Subscriber, SubscriberCleanUp } from '@hub3js/core';
import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';
import type { SignClientTypes } from '@walletconnect/types';

import {
  CAIP_BITCOIN_CHAIN_ID,
  utils,
} from '@rango-dev/wallets-core/namespaces/utxo';
import { AccountId } from 'caip';

import { getAdapter } from '../../adapter/registry.js';
import {
  type Bip122AddressEntry,
  pickPaymentAddress,
} from '../../session/bip122.js';
import { expireWalletConnectTopic } from '../../session/teardown.js';
import { BitcoinEvents, NAMESPACES } from '../../wcConstants.js';

/**
 * WC signals a bip122 account switch via `session_update` (re-shared namespaces
 * with the newly-selected account first), so the active account is published
 * from this event.
 */
export function sessionUpdateSubscriber(): [
  Subscriber<UtxoActions>,
  SubscriberCleanUp<UtxoActions>
] {
  let handler: (args: SignClientTypes.EventArguments['session_update']) => void;

  return [
    async (context) => {
      const adapter = getAdapter();
      const client = await adapter.getClient();
      const [, setState] = context.state();

      handler = (args) => {
        const session = adapter.getSession('utxo');
        if (!session || args.topic !== session.topic) {
          return;
        }

        const bip122Namespace = args.params.namespaces[NAMESPACES.BITCOIN];
        if (!bip122Namespace?.accounts?.length) {
          return;
        }

        const address = new AccountId(bip122Namespace.accounts[0]).address;
        setState(
          'accounts',
          utils.formatAccountsToCAIP([address], CAIP_BITCOIN_CHAIN_ID)
        );
      };

      client.on('session_update', handler);
    },
    (_, err) => {
      const adapter = getAdapter();
      void adapter.getClient().then((client) => {
        if (handler) {
          client.off('session_update', handler);
        }
      });
      return err;
    },
  ];
}

/**
 * Handles WC `session_event` payloads: bip122 `addressesChanged` (publish the
 * new payment address, or run the hub `disconnect` action when the wallet
 * reports no usable addresses).
 */
export function sessionEventSubscriber(): [
  Subscriber<UtxoActions>,
  SubscriberCleanUp<UtxoActions>
] {
  let handler: (args: SignClientTypes.EventArguments['session_event']) => void;

  return [
    async (context) => {
      const adapter = getAdapter();
      const client = await adapter.getClient();
      const [, setState] = context.state();

      handler = (args) => {
        const session = adapter.getSession('utxo');
        if (!session || args.topic !== session.topic) {
          return;
        }

        if (args.params.event.name !== BitcoinEvents.ADDRESSES_CHANGED) {
          return;
        }

        const data = args.params.event.data as Bip122AddressEntry[];
        if (!data?.length) {
          void context.action('disconnect');
          return;
        }

        const paymentAddress = pickPaymentAddress(data);
        if (!paymentAddress) {
          void context.action('disconnect');
          return;
        }

        setState(
          'accounts',
          utils.formatAccountsToCAIP([paymentAddress], CAIP_BITCOIN_CHAIN_ID)
        );
      };

      client.on('session_event', handler);
    },
    (_, err) => {
      const adapter = getAdapter();
      void adapter.getClient().then((client) => {
        if (handler) {
          client.off('session_event', handler);
        }
      });
      return err;
    },
  ];
}

/**
 * Reflects a wallet-initiated `session_delete` into the hub: clears the cached
 * session, expires the WC topic, and runs the hub `disconnect` action.
 */
export function sessionDeleteSubscriber(): [
  Subscriber<UtxoActions>,
  SubscriberCleanUp<UtxoActions>
] {
  let handler: (args: SignClientTypes.EventArguments['session_delete']) => void;

  return [
    async (context) => {
      const adapter = getAdapter();
      const client = await adapter.getClient();

      handler = (event) => {
        const session = adapter.getSession('utxo');
        if (!session || event.topic !== session.topic) {
          return;
        }

        adapter.clearSession('utxo');
        void expireWalletConnectTopic(client, event.topic);
        context.action('disconnect');
      };

      client.on('session_delete', handler);
    },
    (_, err) => {
      const adapter = getAdapter();
      void adapter.getClient().then((client) => {
        if (handler) {
          client.off('session_delete', handler);
        }
      });
      return err;
    },
  ];
}
