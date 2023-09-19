import type { ManagerContext, ManagerState } from './types';
import type {
  ManagerContext as Context,
  Events,
  QueueDef,
} from '@rango-dev/queue-manager-core';
import type { PropsWithChildren } from 'react';

import { Manager } from '@rango-dev/queue-manager-core';
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { initState as initManagerState, useManagerState } from './state';

const ManagerCtx = createContext<{
  manager: ManagerContext;
  state: ManagerState;
}>({
  manager: undefined,
  state: initManagerState,
});

interface PropTypes {
  queuesDefs: QueueDef<any, any, any>[];
  context: Context;
  onPersistedDataLoaded?: Events['onPersistedDataLoaded'];
  isPaused?: boolean;
}

function Provider(props: PropsWithChildren<PropTypes>) {
  // TODO: this is not a proper way but i don't want to change the context interface atm.
  const [, forceRender] = useState({});
  const { state, update } = useManagerState();
  const context = useRef(props.context);

  const manager = useMemo<Manager>(() => {
    return new Manager({
      queuesDefs: props.queuesDefs,
      events: {
        onStorageUpdate: () => {
          forceRender({});
        },
        onCreateQueue: () => {
          forceRender({});
        },
        onCreateTask: () => {
          forceRender({});
        },
        onUpdateQueue: () => {
          forceRender({});
        },
        onUpdateTask: () => {
          forceRender({});
        },
        onPersistedDataLoaded: (manager) => {
          forceRender({});

          if (props.onPersistedDataLoaded) {
            props.onPersistedDataLoaded(manager);
          }

          /*
           * This condition will make sure, we only update the `loadedFromPersistor`.
           * But be aware `onPersistedDataLoaded` is calling after each `sync` which means can be called multiple times.
           */
          if (!state.loadedFromPersistor) {
            update('loadedFromPersistor', true);
          }
        },
        onTaskBlock: () => {
          forceRender({});
        },
        onDeleteQueue: () => {
          forceRender({});
        },
      },
      context: context || {},
      isPaused: props.isPaused,
    });
  }, []);

  useLayoutEffect(() => {
    context.current = props.context;
  }, [props.context]);

  useEffect(() => {
    if (typeof props.isPaused !== 'undefined') {
      if (props.isPaused) {
        manager.pause();
      } else {
        manager.run();
      }
      forceRender({});
    }
  }, [props.isPaused]);

  const value = useMemo(() => ({ manager, state }), [manager, state]);

  return (
    <ManagerCtx.Provider value={value}>{props.children}</ManagerCtx.Provider>
  );
}

export function useManager(): { manager: ManagerContext; state: ManagerState } {
  const context = useContext(ManagerCtx);
  if (!context) {
    throw Error('useManager can only be used within the Provider component');
  }
  return context;
}

export default Provider;
