import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ManagerContext as Context,
  Manager,
  QueueDef,
} from '@rangodev/queue-manager-core';
import { ManagerContext } from './types';

const ManagerCtx = createContext<{ manager: ManagerContext; count: number }>({
  manager: undefined,
  count: 0,
});

interface PropTypes {
  queuesDefs: QueueDef<any>[];
  context: Context;
}

function Provider(props: PropsWithChildren<PropTypes>) {
  // TODO: this is not a proper way but i don't want to change the context interface atm.
  const [count, forceRender] = useState(0);
  const context = useRef(props.context);

  const manager = useMemo<Manager>(() => {
    return new Manager({
      queuesDefs: props.queuesDefs,
      events: {
        onStorageUpdate: () => {
          forceRender((prev) => prev + 1);
        },
        onCreateQueue: () => {
          forceRender((prev) => prev + 1);
        },
        onCreateTask: () => {
          forceRender((prev) => prev + 1);
        },
        onUpdateQueue: () => {
          forceRender((prev) => prev + 1);
        },
        onUpdateTask: () => {
          forceRender((prev) => prev + 1);
        },
      },
      context: context || {},
    });
  }, []);

  useLayoutEffect(() => {
    context.current = props.context;
  }, [props.context]);

  return (
    <ManagerCtx.Provider value={{ manager, count }}>
      {props.children}
    </ManagerCtx.Provider>
  );
}

export function useManager(): { manager: ManagerContext; count: number } {
  const context = useContext(ManagerCtx);
  if (!context)
    throw Error('useManager can only be used within the Provider component');
  return context;
}

export default Provider;
