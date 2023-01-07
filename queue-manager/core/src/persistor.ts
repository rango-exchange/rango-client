import { openDB, DBSchema, IDBPDatabase } from 'idb';

import { QueueID, QueueName } from './manager';
import { QueueState, Task } from './queue';
import { QueueStorage, Status } from './types';

const DB_NAME = 'queues-manager';
const OBJECT_STORE_NAME = 'queues';
const VERSION = 1;

export interface PersistedQueue {
  id: QueueID;
  createdAt: number;
  name: QueueName;
  status: Status;
  state: QueueState;
  tasks: Task[];
  storage: QueueStorage;
}

type UpdatePersistedQueue = Partial<
  Pick<PersistedQueue, 'status' | 'state' | 'tasks' | 'storage'>
>;

interface Database extends DBSchema {
  queues: {
    value: PersistedQueue;
    key: string;
  };
}

class Persistor {
  db: Promise<IDBPDatabase<Database>>;
  constructor() {
    this.db = openDB<Database>(DB_NAME, VERSION, {
      upgrade(db) {
        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
      },
    });
  }
  async insertQueue(queue: PersistedQueue) {
    const db = await this.db;
    const queueRecord = await db.get(OBJECT_STORE_NAME, queue.id);
    if (queueRecord) {
      console.log('[Persistor] Queue already exists inside persistor.');
    } else {
      await db.add(OBJECT_STORE_NAME, queue);
      console.log('[Persistor] Queue added to IndexedDB successfully.');
    }
  }
  async updateQueue(id: QueueID, queue: UpdatePersistedQueue) {
    const db = await this.db;
    const currentRecord = await db.get(OBJECT_STORE_NAME, id);

    if (!currentRecord) {
      console.log("[Persistor] Requested queue for update doesn't exist.");
      return;
    }

    const updatedRecord = {
      ...currentRecord,
      ...queue,
    };
    await db.put(OBJECT_STORE_NAME, updatedRecord);
  }
  async getAll() {
    const db = await this.db;
    const results = await db.getAll(OBJECT_STORE_NAME);

    return results;
  }
}

export default Persistor;
