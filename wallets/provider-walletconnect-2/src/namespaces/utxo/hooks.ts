import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import {
  CAIP_BITCOIN_CHAIN_ID,
  utils,
} from '@rango-dev/wallets-core/namespaces/utxo';
import { AccountId } from 'caip';

import {
  type Bip122AddressEntry,
  filterBip122Accounts,
  getAnnouncedAddresses,
  pickPaymentAddress,
} from '../../session/bip122.js';
import { expireWalletConnectTopic } from '../../session/teardown.js';
import { BitcoinEvents, NAMESPACES } from '../../wcConstants.js';
import { createSessionSubscriber } from '../subscriber.js';

/**
 * WC signals a bip122 account switch via `session_update` (re-shared namespaces
 * with the newly-selected account first), so the active account is published
 * from this event.
 */
export function sessionUpdateSubscriber() {
  return createSessionSubscriber<'session_update', UtxoActions>(
    'utxo',
    'session_update',
    ({ args, session, adapter, context }) => {
      const bip122Namespace = args.params.namespaces[NAMESPACES.BITCOIN];
      if (!bip122Namespace?.accounts?.length) {
        return;
      }

      /*
       * Keep the cached struct in step with what the wallet just re-shared:
       * `sessionEventSubscriber` reads the shared account back out of it, and
       * a stale copy would keep re-publishing the account that was replaced.
       */
      adapter.cacheSession('utxo', {
        ...session,
        namespaces: args.params.namespaces,
      });

      const [, setState] = context.state();
      setState(
        'accounts',
        utils.formatAccountsToCAIP(
          [new AccountId(bip122Namespace.accounts[0]).address],
          CAIP_BITCOIN_CHAIN_ID
        )
      );
    }
  );
}

/**
 * Handles WC `session_event` payloads: bip122 `addressesChanged` (re-publish the
 * account the session shares, fall back to the announced payment address once
 * the wallet stops offering that account, or run the hub `disconnect` action
 * when it reports no usable addresses at all).
 */
export function sessionEventSubscriber() {
  return createSessionSubscriber<'session_event', UtxoActions>(
    'utxo',
    'session_event',
    ({ args, session, context }) => {
      if (args.params.event.name !== BitcoinEvents.ADDRESSES_CHANGED) {
        return;
      }

      const data = args.params.event.data as
        | Bip122AddressEntry[]
        | string[]
        | undefined;
      const announced = getAnnouncedAddresses(data);
      if (!announced.length) {
        void context.action('disconnect');
        return;
      }

      /*
       * The payload is not a "selected account" signal: Ledger announces every
       * address in the wallet at once, so a pick out of it says nothing about
       * which account the session shares. Only trust the pick once the wallet
       * has dropped the shared account from the list.
       */
      const sharedAddress = filterBip122Accounts(session)
        .map((account) => account.address)
        .find((address) =>
          announced.some(
            (announcedAddress) =>
              announcedAddress.toLowerCase() === address.toLowerCase()
          )
        );

      /*
       * `||`, not `??`: `pickPaymentAddress` reads `entries[0].address` as its
       * own fallback and can hand back an empty string, which `??` would keep.
       * `announced` is non-empty and holds only truthy addresses, so its first
       * entry always settles this.
       */
      const activeAddress =
        sharedAddress || pickPaymentAddress(data) || announced[0];

      const [, setState] = context.state();
      setState(
        'accounts',
        utils.formatAccountsToCAIP([activeAddress], CAIP_BITCOIN_CHAIN_ID)
      );
    }
  );
}

/**
 * Reflects a wallet-initiated `session_delete` into the hub: clears the cached
 * session, expires the WC topic, and runs the hub `disconnect` action.
 */
export function sessionDeleteSubscriber() {
  return createSessionSubscriber<'session_delete', UtxoActions>(
    'utxo',
    'session_delete',
    ({ args, adapter, context }) => {
      adapter.clearSession('utxo');
      void adapter
        .getClient()
        .then(async (client) => expireWalletConnectTopic(client, args.topic));
      context.action('disconnect');
    }
  );
}
