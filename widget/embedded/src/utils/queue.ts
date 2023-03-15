import { Manager } from '@rango-dev/queue-manager-core';
import {
  PendingSwapWithQueueID,
  SwapStorage,
} from '@rango-dev/queue-manager-rango-preset';

export const getPendingSwaps = (manager: Manager | undefined) => {
  const result: PendingSwapWithQueueID[] = [];

  manager?.getAll().forEach((q, id) => {
    const storage = q.list.getStorage() as SwapStorage;

    if (storage?.swapDetails) {
      result.push({
        id,
        swap: storage?.swapDetails,
      });
    }
  });

  return result.sort(
    (a, b) => Number(b.swap.creationTime) - Number(a.swap.creationTime)
  );
};
