import Queue from './queue';

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
