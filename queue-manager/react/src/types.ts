import { Manager } from '@rango-dev/queue-manager-core';

export type ManagerContext = Manager | undefined;
export type ManagerState =
  | {
      isLoaded: boolean;
    }
  | undefined;
