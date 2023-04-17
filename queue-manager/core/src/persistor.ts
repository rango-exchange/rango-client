import { openDB, DBSchema, IDBPDatabase } from 'idb';

import { QueueID } from './manager';
import { PersistedQueue } from './types';

export const DB_NAME = 'queues-manager';
const OBJECT_STORE_NAME = 'queues';
const VERSION = 1;

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
      // Queue already exists inside persistor.
    } else {
      await db.add(OBJECT_STORE_NAME, queue);
    }
  }
  async updateQueue(id: QueueID, queue: UpdatePersistedQueue) {
    const db = await this.db;
    const currentRecord = await db.get(OBJECT_STORE_NAME, id);

    if (!currentRecord) return;

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

  public async isLoaded() {
    const db = await this.db;
    const count = await db.count(OBJECT_STORE_NAME);

    return !!count;
  }
}

export default Persistor;
