import React, { PropsWithChildren } from 'react';
import { Provider as ManagerProvider } from '@rango-dev/queue-manager-react';
import { swapQueueDef } from '@rango-dev/queue-manager-rango-preset';

function QueueManager(props: PropsWithChildren<{}>) {
  const context = {};
  return (
    <ManagerProvider
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      queuesDefs={[swapQueueDef]}
      context={context}
      onPersistedDataLoaded={(_manager) => {}}
      isPaused={false}
    >
      {props.children}
    </ManagerProvider>
  );
}

export default QueueManager;
