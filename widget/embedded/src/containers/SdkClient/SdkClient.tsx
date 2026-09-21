import type { RangoSdkClient } from '@rango-dev/sdk';
import type { PropsWithChildren } from 'react';

import { createClient } from '@rango-dev/sdk';
import { IdbStore } from '@rango-dev/sdk-store-idb';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useContext, useEffect, useMemo, useRef } from 'react';

import { AppStoreContext } from '../../store/AppStore';
import { useExecutionStore } from '../../store/executions';
import { useUiStore } from '../../store/ui';
import { getConfig } from '../../utils/configs';

/** How often a paused tab reads the store, since it hears no events from the active one. */
const SYNC_INTERVAL = 5_000;

/**
 * Creates the SDK client once and keeps it pointed at the host's live wallet
 * providers and meta. It mirrors the executions on record into the execution
 * store and keeps them current. It also switches the engine with the active
 * tab, so only one tab runs swaps: `resume` when this tab becomes active,
 * which is also what picks running swaps up after a reload, and `pause`
 * otherwise.
 */
export function SdkClient(props: PropsWithChildren<{ apiKey?: string }>) {
  const { hubProvider } = useWallets();
  const appStore = useContext(AppStoreContext);
  const isActiveTab = useUiStore.use.isActiveTab();

  // Read through refs at call time, so the client never holds a stale accessor.
  const hubProviderRef = useRef(hubProvider);
  hubProviderRef.current = hubProvider;
  const appStoreRef = useRef(appStore);
  appStoreRef.current = appStore;

  const store = useMemo(() => new IdbStore(), []);
  const client: RangoSdkClient = useMemo(
    () =>
      createClient({
        apiKey: props.apiKey || getConfig('API_KEY'),
        baseUrl: getConfig('BASE_URL'),
        getProvider: (type) => {
          try {
            return hubProviderRef.current(type);
          } catch {
            // The wallets layer throws for a wallet it has no provider for.
            return undefined;
          }
        },
        getMeta: () => {
          const state = appStoreRef.current?.getState();
          return {
            blockchains: state?.blockchains() ?? [],
            // Only confirm prices from tokens, and listing them is not free.
            get tokens() {
              return state?.tokens();
            },
          };
        },
        store,
      }),
    [props.apiKey, store]
  );

  useEffect(() => {
    const unsubscribe = client.subscribe((event) => {
      if (event.type === 'deleted') {
        useExecutionStore.getState().remove(event.requestId);
      } else {
        useExecutionStore.getState().upsert(event.execution);
      }
    });
    void loadExecutions(client);
    return unsubscribe;
  }, [client]);

  useEffect(() => {
    if (isActiveTab) {
      client.resume().catch(console.error);
      // Another tab may have run swaps while this one was paused.
      void loadExecutions(client);
      return undefined;
    }
    client.pause();
    const interval = setInterval(() => {
      void loadExecutions(client);
    }, SYNC_INTERVAL);
    return () => clearInterval(interval);
  }, [client, isActiveTab]);

  return <>{props.children}</>;
}

/** Reads every execution on record into the store. A failed read still lets the pages render. */
async function loadExecutions(client: RangoSdkClient): Promise<void> {
  const { setAll, markLoaded } = useExecutionStore.getState();
  try {
    setAll(await client.history.getAll());
  } catch (error) {
    console.error(error);
    markLoaded();
  }
}
