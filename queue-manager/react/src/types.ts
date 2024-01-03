import { Manager } from '@yeager-dev/queue-manager-core';

export type ManagerContext = Manager | undefined;
export type ManagerState = {
  loadedFromPersistor: boolean;
};
