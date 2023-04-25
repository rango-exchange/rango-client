import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ManagerContext as Context,
  Manager,
  QueueDef,
  Events,
} from '@rango-dev/queue-manager-core';
import { ManagerContext, ManagerState } from './types';

const ManagerCtx = createContext<{ manager: ManagerContext, state: ManagerState}>({
  manager: undefined,
  state: undefined
});

interface PropTypes {
  queuesDefs: QueueDef<any>[];
  context: Context;
  onPersistedDataLoaded?: Events['onPersistedDataLoaded'];
  isPaused?: boolean;
}

function Provider(props: PropsWithChildren<PropTypes>) {
  // TODO: this is not a proper way but i don't want to change the context interface atm.
  const [, forceRender] = useState({});
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
        },
        onTaskBlock: () => {
          forceRender({});
        },
      },
      context: context || {},
      isPaused: props.isPaused,
    });
  }, []);

  const state: ManagerState = {
    isLoaded: manager.isLoaded(),
  }

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

  return (
    <ManagerCtx.Provider value={{ manager, state }}>
      {props.children}
    </ManagerCtx.Provider>
  );
}

export function useManager(): { manager: ManagerContext, state: ManagerState } {
  const context = useContext(ManagerCtx);
  if (!context)
    throw Error('useManager can only be used within the Provider component');
  return context;
}

export default Provider;
