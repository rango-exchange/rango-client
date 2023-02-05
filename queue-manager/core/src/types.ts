import { QueueID, QueueName } from './manager';
import Queue, { QueueState, Task } from './queue';

export enum Status {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',
  BLOCKED = 'BLOCKED',
}

export type QueueStorage = Record<string, unknown>;

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
