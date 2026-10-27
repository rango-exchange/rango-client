import type { QueueID, QueueName } from './manager';
import type { QueueState, Task } from './queue';
import type Queue from './queue';

export enum Status {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',
  BLOCKED = 'BLOCKED',
}

export const SYNC_POLLING_INTERVAL = 5_000;

export type QueueStorage = Record<string, unknown>;

/**
 * A task payload: a serializable value only, so it is persisted and restored unchanged.
 */
export type TaskPayload =
  | string
  | number
  | boolean
  | null
  | TaskPayload[]
  | { [key: string]: TaskPayload };

export type QueueType = Queue;

export interface PersistedQueue {
  id: QueueID;
  createdAt: number;
  name: QueueName;
  status: Status;
  state: QueueState;
  tasks: Task[];
  storage: QueueStorage;
}
