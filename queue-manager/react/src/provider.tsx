import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Manager, QueueDef } from '@rangodev/queue-manager-core';
import { ManagerContext } from './types';

const ManagerCtx = createContext<ManagerContext>(undefined);

interface PropTypes {
  queuesDefs: QueueDef<any>[];
}

function Provider(props: PropsWithChildren<PropTypes>) {
  // TODO: this is not a proper way but i don't want to change the context interface atm.
  const [count, forceRender] = useState(0);
  const manager = useMemo<Manager>(() => {
    return new Manager({
      queuesDefs: props.queuesDefs,
      events: {
        onContextUpdate: () => {
          forceRender(count + 1);
        },
        onCreateQueue: () => {
          forceRender(count + 1);
        },
        onCreateTask: () => {
          forceRender(count + 1);
        },
        onUpdateQueue: () => {
          forceRender(count + 1);
        },
        onUpdateTask: () => {
          forceRender(count + 1);
        },
      },
    });
  }, []);

  return <ManagerCtx.Provider value={manager}>{props.children}</ManagerCtx.Provider>;
}

export function useManager(): ManagerContext {
  const context = useContext(ManagerCtx);
  if (!context) throw Error('useManager can only be used within the Provider component');
  return context;
}

export default Provider;
