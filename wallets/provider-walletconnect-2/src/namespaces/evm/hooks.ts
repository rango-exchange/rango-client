import type { Subscriber, SubscriberCleanUp } from '@hub3js/core';
import type { EvmActions } from '@hub3js/evm';
import type { SignClientTypes } from '@walletconnect/types';

import { utils } from '@hub3js/evm';
import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
import { AccountId, ChainId } from 'caip';

import { type WalletConnectAdapter } from '../../adapter/adapter.js';
import { getAdapter } from '../../adapter/registry.js';
import { filterEvmAccounts } from '../../session/evm.js';
import {
  expireWalletConnectTopic,
  getAccountsFromEvent,
  getPersistedChainId,
  persistCurrentChainId,
} from '../../session/index.js';
import { chainReferenceToHex, parseChainReference } from '../../utils.js';
import { EthereumEvents } from '../../wcConstants.js';

/**
 * WC signals an account switch via `session_update` (re-shared namespaces with the
 * newly-selected account first), so the active account is published from this event.
 */
export function sessionUpdateSubscriber(): [
  Subscriber<EvmActions>,
  SubscriberCleanUp<EvmActions>
] {
  let handler: (args: SignClientTypes.EventArguments['session_update']) => void;

  return [
    async (context) => {
      const adapter = getAdapter();
      const client = await adapter.getClient();
      const [getState, setState] = context.state();

      handler = (args) => {
        void (async () => {
          const session = adapter.getSession('evm');
          if (!session || args.topic !== session.topic) {
            return;
          }

          const allAccounts = getAccountsFromEvent(args);
          if (!allAccounts.length) {
            return;
          }

          const entries = allAccounts.map((accountsWithChain) => ({
            address: accountsWithChain.accounts[0],
            chainId: accountsWithChain.chainId,
          }));

          const hubNetwork = getState().network;
          const persistedChain = await getPersistedChainId(client);
          const activeReference =
            parseChainReference(hubNetwork ?? undefined) ?? persistedChain;

          let evmAccounts = filterEvmAccounts(entries, activeReference);
          if (!evmAccounts.length) {
            evmAccounts = filterEvmAccounts(entries);
          }
          if (!evmAccounts.length) {
            return;
          }

          const chainIdHex = chainReferenceToHex(evmAccounts[0].chainId);
          setState(
            'accounts',
            utils.formatAccountsToCAIP([evmAccounts[0].accounts[0]], chainIdHex)
          );
          setState('network', chainIdHex);
        })();
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
 * Handles WC `session_event` payloads: EIP-1193 `accountsChanged` (publish the new
 * accounts) and `chainChanged` (update and persist the active chain).
 *
 * The WC client is reached asynchronously via `adapter.getClient()`, so the
 * builder's (synchronous) instance is the adapter itself and each operator
 * resolves the client when needed. `accountsChanged` sets `network` in
 * `onSwitchAccount` and lets the default flow publish `accounts` via `format`;
 * every other event (including `chainChanged`, which only touches `network`)
 * calls `preventDefault` so the default account publish is skipped.
 */
export function sessionEventSubscriber(): [
  Subscriber<EvmActions>,
  SubscriberCleanUp<EvmActions>
] {
  type SessionEvent = SignClientTypes.EventArguments['session_event'];

  return new ChangeAccountSubscriberBuilder<
    SessionEvent,
    WalletConnectAdapter,
    EvmActions
  >()
    .getInstance(getAdapter)
    .onSwitchAccount((event, context) => {
      const args = event.payload;
      const adapter = getAdapter();
      const session = adapter.getSession('evm');
      const [, setState] = context.state();

      if (!session || args.topic !== session.topic) {
        event.preventDefault();
        return;
      }

      if (args.params.event.name === EthereumEvents.ACCOUNTS_CHANGED) {
        const chainIdHex = chainReferenceToHex(
          ChainId.parse(args.params.chainId).reference
        );
        setState('network', chainIdHex);
        // Let the default flow publish `accounts` via `format`.
        return;
      }

      if (args.params.event.name === EthereumEvents.CHAIN_CHANGED) {
        const chainIdHex = chainReferenceToHex(args.params.event.data);
        setState('network', chainIdHex);
        void adapter
          .getClient()
          .then(async (client) => persistCurrentChainId(client, chainIdHex));
      }

      // Only `accountsChanged` publishes accounts; skip the default otherwise.
      event.preventDefault();
    })
    .format(async (_adapter, args) => {
      const accounts = args.params.event.data.map(
        (account: string) => new AccountId(account).address
      );
      const chainIdHex = chainReferenceToHex(
        ChainId.parse(args.params.chainId).reference
      );
      return utils.formatAccountsToCAIP(accounts, chainIdHex);
    })
    .addEventListener((adapter, callback) => {
      void adapter.getClient().then((client) => {
        client.on('session_event', callback);
      });
    })
    .removeEventListener((adapter, callback) => {
      void adapter.getClient().then((client) => {
        client.off('session_event', callback);
      });
    })
    .build();
}

/**
 * Reflects a wallet-initiated `session_delete` into the hub: clears the cached
 * session, expires the WC topic, and runs the hub `disconnect` action.
 */
export function sessionDeleteSubscriber(): [
  Subscriber<EvmActions>,
  SubscriberCleanUp<EvmActions>
] {
  let handler: (args: SignClientTypes.EventArguments['session_delete']) => void;

  return [
    async (context) => {
      const adapter = getAdapter();
      const client = await adapter.getClient();

      handler = (event) => {
        const session = adapter.getSession('evm');
        if (!session || event.topic !== session.topic) {
          return;
        }

        adapter.clearSession('evm');
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
