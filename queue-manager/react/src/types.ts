import type { Manager } from '@arlert-dev/queue-manager-core';

export type ManagerContext = Manager | undefined;
export type ManagerState = {
  loadedFromPersistor: boolean;
};
