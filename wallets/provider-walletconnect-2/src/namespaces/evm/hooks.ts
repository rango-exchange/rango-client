import type { EvmActions } from '@hub3js/evm';

import { utils } from '@hub3js/evm';
import { ChainId } from 'caip';

import {
  extractAddress,
  getAccountsFromEvent,
} from '../../session/accounts.js';
import {
  getPersistedChainId,
  persistCurrentChainId,
} from '../../session/chain-state.js';
import { filterEvmAccounts } from '../../session/evm.js';
import { expireWalletConnectTopic } from '../../session/teardown.js';
import { chainReferenceToHex, parseChainReference } from '../../utils.js';
import { EthereumEvents, NAMESPACES } from '../../wcConstants.js';
import { createSessionSubscriber } from '../subscriber.js';

/**
 * WC signals an account switch via `session_update` (re-shared namespaces with the
 * newly-selected account first), so the active account is published from this event.
 */
export function sessionUpdateSubscriber() {
  return createSessionSubscriber<'session_update', EvmActions>(
    'evm',
    'session_update',
    async ({ args, session, adapter, context }) => {
      /*
       * Keep the cached struct in step with what the wallet just re-shared.
       * `switchEvmNetwork` reads the authorized chains and methods back out
       * of it, so a stale copy rejects a chain the wallet has since added
       * (`wallet_addEthereumChain` lands here as a `session_update`) with
       * "Chain X is not configured".
       */
      if (args.params.namespaces[NAMESPACES.ETHEREUM]) {
        adapter.cacheSession('evm', {
          ...session,
          namespaces: args.params.namespaces,
        });
      }

      const allAccounts = getAccountsFromEvent(args);
      if (!allAccounts.length) {
        return;
      }

      const entries = allAccounts.map((accountsWithChain) => ({
        address: accountsWithChain.accounts[0],
        chainId: accountsWithChain.chainId,
      }));

      const [getState, setState] = context.state();
      const hubNetwork = getState().network;
      const persistedChain = await getPersistedChainId(
        await adapter.getClient()
      );
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
    }
  );
}

/**
 * Addresses out of an `accountsChanged` payload. Spec says `string[]`, but wallets
 * forwarding the EIP-1193 event as-is send a bare value, so the shape is coerced
 * before anything reads it.
 */
function eventAccounts(data: unknown): string[] {
  return (Array.isArray(data) ? data : [data])
    .filter((entry): entry is string => typeof entry === 'string' && !!entry)
    .map(extractAddress);
}

/**
 * Handles WC `session_event` payloads: EIP-1193 `accountsChanged` (publish the new
 * accounts, or disconnect when the wallet revokes them all) and `chainChanged`
 * (update and persist the active chain). Any other event is ignored.
 */
export function sessionEventSubscriber() {
  return createSessionSubscriber<'session_event', EvmActions>(
    'evm',
    'session_event',
    ({ args, adapter, context }) => {
      const [, setState] = context.state();

      if (args.params.event.name === EthereumEvents.ACCOUNTS_CHANGED) {
        const accounts = eventAccounts(args.params.event.data);
        /*
         * An empty payload is the wallet revoking access (locked, or the account
         * unlinked from this dApp), not a switch - there is nothing to publish.
         */
        if (!accounts.length) {
          void context.action('disconnect');
          return;
        }

        const chainIdHex = chainReferenceToHex(
          ChainId.parse(args.params.chainId).reference
        );
        setState('network', chainIdHex);
        setState('accounts', utils.formatAccountsToCAIP(accounts, chainIdHex));
        return;
      }

      if (args.params.event.name === EthereumEvents.CHAIN_CHANGED) {
        const chainIdHex = chainReferenceToHex(args.params.event.data);
        setState('network', chainIdHex);
        void adapter
          .getClient()
          .then(async (client) => persistCurrentChainId(client, chainIdHex));
      }
    }
  );
}

/**
 * Reflects a wallet-initiated `session_delete` into the hub: clears the cached
 * session, expires the WC topic, and runs the hub `disconnect` action.
 */
export function sessionDeleteSubscriber() {
  return createSessionSubscriber<'session_delete', EvmActions>(
    'evm',
    'session_delete',
    ({ args, adapter, context }) => {
      adapter.clearSession('evm');
      void adapter
        .getClient()
        .then(async (client) => expireWalletConnectTopic(client, args.topic));
      context.action('disconnect');
    }
  );
}
