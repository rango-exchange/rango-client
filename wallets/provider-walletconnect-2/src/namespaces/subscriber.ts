import type { WalletConnectAdapter } from '../adapter/adapter.js';
import type { WalletConnectNamespace } from '../types.js';
import type {
  Actions,
  Context,
  Subscriber,
  SubscriberCleanUp,
} from '@hub3js/core';
import type { SessionTypes, SignClientTypes } from '@walletconnect/types';

import { debug } from '@rango-dev/logging-core';

import { getAdapter } from '../adapter/registry.js';

/** The WC client events a namespace subscribes to. */
export type SessionEventName =
  | 'session_update'
  | 'session_event'
  | 'session_delete';

export type SessionEventHandler<
  Name extends SessionEventName,
  ActionsType extends Actions<ActionsType>
> = (event: {
  args: SignClientTypes.EventArguments[Name];
  /** The cached session this event was matched against. */
  session: SessionTypes.Struct;
  adapter: WalletConnectAdapter;
  context: Context<ActionsType>;
}) => void | Promise<void>;

function logHandlerError(error: unknown) {
  debug(error instanceof Error ? error : new Error(String(error)));
}

/**
 * Builds a hub subscriber for one WC client event, scoped to one namespace.
 *
 * Every namespace hook needs the same four things - resolve the client, only act
 * on events for the session this namespace has cached, register, and unregister
 * the exact same handler reference. Getting the topic guard wrong is what makes a
 * hook act on the other namespace's session, so it lives here rather than being
 * repeated per hook.
 */
export function createSessionSubscriber<
  Name extends SessionEventName,
  ActionsType extends Actions<ActionsType>
>(
  namespace: WalletConnectNamespace,
  event: Name,
  handle: SessionEventHandler<Name, ActionsType>
): [Subscriber<ActionsType>, SubscriberCleanUp<ActionsType>] {
  let handler: ((args: SignClientTypes.EventArguments[Name]) => void) | null =
    null;

  return [
    async (context) => {
      const adapter = getAdapter();
      const client = await adapter.getClient();

      /*
       * A namespace re-runs its `before` subscribers on every connect, so drop the
       * previous registration first - otherwise each reconnect leaves another live
       * handler behind and only the last one is ever removed.
       */
      if (handler) {
        client.off(event, handler);
      }

      handler = (args) => {
        const session = adapter.getSession(namespace);
        if (!session || args.topic !== session.topic) {
          return;
        }

        /*
         * WC dispatches these from its own async request pipeline with nothing
         * catching downstream, so a throw here (a payload shaped unlike anything
         * the handler expects) would surface as an unhandled rejection and take
         * the rest of that pipeline's processing with it. Async handlers are
         * covered too - their rejection lands nowhere otherwise.
         */
        try {
          const handled = handle({ args, session, adapter, context });
          if (handled instanceof Promise) {
            void handled.catch(logHandlerError);
          }
        } catch (error) {
          logHandlerError(error);
        }
      };

      client.on(event, handler);
    },
    (_, err) => {
      const currentHandler = handler;
      if (currentHandler) {
        handler = null;
        void getAdapter()
          .getClient()
          .then((client) => client.off(event, currentHandler));
      }
      return err;
    },
  ];
}
