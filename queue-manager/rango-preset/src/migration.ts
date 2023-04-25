import {
  PersistedQueue,
  Persistor,
  Status,
  DB_NAME,
} from '@rango-dev/queue-manager-core';
import { v4 as uuid } from 'uuid';
import { PendingSwap, PendingSwapStep } from './shared';
import { SwapActionTypes } from './types';

const MIGRATED_KEY = 'migratedToQueueManager';

/**
 *
 * If `MIGRATED_KEY` is set, it means we already migrated data from localstorage.
 *
 */
function migrated(): boolean {
  return !!window.localStorage.getItem(MIGRATED_KEY);
}

async function hasQueueManagerOnIDB(): Promise<boolean> {
  try {
    return (await (window.indexedDB as any).databases())
      .map((db: any) => db.name)
      .includes(DB_NAME);
  } catch {
    return false;
  }
}

/**
 *
 * By calling this function, we first check if the data already migrated or not,
 * If not, starting to migrating to IndexedDb with proper format that queue manager is understand.
 *
 */
async function migration(): Promise<boolean> {
  const swapsFromStorage = window.localStorage.getItem('pendingSwaps');
  const hasIndexDB = await hasQueueManagerOnIDB();

  // For new users or already migrated.
  if (!swapsFromStorage || migrated() || hasIndexDB) {
    return true;
  }

  // For old users, but they didn't do any swaps yet.
  const swaps: PendingSwap[] = JSON.parse(swapsFromStorage);
  const convertedSwaps: PersistedQueue[] = [];

  swaps.forEach((swap) => {
    /* 
      For running task we need to add some more work
      We need to create a queue task to be run and resume the running task from queue manager.
     */
    if (swap.status === 'running') {
      const taskId = uuid();

      const convertedSwap: PersistedQueue = {
        id: swap.requestId,
        createdAt: Number(swap.creationTime),
        name: 'swap',
        status: Status.RUNNING,
        storage: {
          swapDetails: swap,
        },
        state: {
          status: Status.RUNNING,
          activeTaskIndex: 0,
          tasks: {
            [taskId]: {
              blockedFor: null,
              status: Status.RUNNING,
            },
          },
        },
        tasks: [
          {
            id: taskId,
            action: SwapActionTypes.SCHEDULE_NEXT_STEP,
          },
        ],
      };
      convertedSwaps.push(convertedSwap);
    } else {
      /*
       * For failed or successful swaps, we only move it to IndexedDB,
       * And there is no need to consider them to be run.
       */
      const status = swap.status === 'success' ? Status.SUCCESS : Status.FAILED;
      if (status === Status.FAILED) {
        // To make sure last step (current step) of a failed swap has a failed status
        swap.steps.forEach((step: PendingSwapStep) => {
          if (!['created', 'failed'].includes(step.status)) {
            step.status = 'failed';
          }
        });
      }

      const convertedSwap: PersistedQueue = {
        id: swap.requestId,
        createdAt: Number(swap.creationTime),
        name: 'swap',
        status,
        storage: {
          swapDetails: swap,
        },
        state: {
          status,
          activeTaskIndex: 0,
          tasks: {},
        },
        tasks: [],
      };

      convertedSwaps.push(convertedSwap);
    }
  });

  // Getting an instance from persistor, so we can directly put our data inside it.
  const persistor = new Persistor();

  const promises = convertedSwaps.map((queue) => persistor.insertQueue(queue));
  await Promise.all(promises);

  // Mark as the data has been successfully migrated.
  window.localStorage.setItem(MIGRATED_KEY, '1');

  return true;
}

export { migration, migrated };
