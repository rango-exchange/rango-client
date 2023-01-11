import { v4 as uuidv4 } from 'uuid';
import Persistor from './persistor';
import Queue, { QueueEventHandlers, TaskEvent } from './queue';
import { QueueStorage, Status } from './types';

export type ManagerContext = object;
export type QueueName = string;
export type QueueID = string;
export type BlockedTask = {
  queue_id: string;
  task_id: string;
  action: string;
  reason: Record<string, unknown>;
  storage: {
    get: () => QueueStorage;
    set: (data: QueueStorage) => QueueStorage;
  };
};

export type SetStorage<T> = (nextStorage: T) => T;

export interface ExecuterActions<
  T extends QueueStorage = QueueStorage,
  V extends string = string,
  C = ManagerContext
> {
  next: () => void;
  retry: () => void;
  failed: () => void;
  schedule: (actionName: V) => void;
  setStorage: SetStorage<T>;
  getStorage: () => T;
  block: (reason: Record<string, unknown>) => void;
  unblock: () => void;
  context: C;
}

export interface QueueDef<
  T extends QueueStorage = QueueStorage,
  V extends string = string,
  C = ManagerContext
> {
  name: QueueName;
  actions: {
    [K in V]: (actions: ExecuterActions<T, V, C>) => void | Promise<void>;
  };
  events?: Partial<QueueEventHandlers>;
  run: V[];
  whenTaskBlocked?: (
    event: any,
    params: {
      queue_id: string;
      queue: Queue;
      context: C;
      getBlockedTasks: () => BlockedTask[];
      forceRun: (queue_id: string, data?: object) => void;
      retry: () => void;
    }
  ) => void;
}

interface Events {
  onCreateQueue: (queue: QueueInfo & { id: QueueID }) => void;
  onUpdateQueue: (queue_id: QueueID, queue: QueueInfo) => void;
  onCreateTask: (queue_id: QueueID, event: TaskEvent) => void;
  onUpdateTask: (queue_id: QueueID, event: TaskEvent) => void;
  onStorageUpdate: (queue_id: QueueID, data: QueueStorage) => void;
  onTaskBlock: (queue_id: QueueID) => void;
}

interface ManagerOptions {
  events?: Partial<Events>;
  queuesDefs: QueueDef[];
  context?: ManagerContext;
}

export interface QueueInfo {
  name: QueueName;
  createdAt: number;
  status: Status;
  list: Queue;
  actions: {
    run: () => void;
    cancel: () => void;
    setStorage: SetStorage<any>;
    getStorage: () => any;
  };
}

class Manager {
  private queuesDefs = new Map<QueueName, QueueDef>();
  private queues = new Map<QueueID, QueueInfo>();
  private events: Events;
  private persistor: Persistor;
  private context: ManagerContext;

  constructor(options: ManagerOptions) {
    const defaultEventHandlers: Events = {
      onCreateQueue: () => {
        // ...
      },
      onCreateTask: () => {
        // ...
      },
      onUpdateQueue: () => {
        // ...
      },
      onUpdateTask: () => {
        // ...
      },
      onStorageUpdate: () => {
        // ...
      },
      onTaskBlock: () => {
        // ...
      },
    };

    if (options.events) {
      this.events = {
        ...defaultEventHandlers,
        ...options.events,
        // onUpdateQueue: defaultEventHandlers.onUpdateQueue,
        // onUpdateTask: defaultEventHandlers.onUpdateTask,
      };

      console.log('Events have been initialized', { a: options.events });
    } else {
      this.events = defaultEventHandlers;
    }

    options.queuesDefs.map((qDef) => {
      this.queuesDefs.set(qDef.name, qDef);
    });

    this.context = options.context || {};
    this.persistor = new Persistor();
    this.initQueuesFromPersistor();
  }

  private async initQueuesFromPersistor() {
    const queues = await this.persistor.getAll();

    queues.forEach((q) => {
      const list = this.makeList({
        queue_id: q.id,
        queue_name: q.name,
      });
      this.makeQueue(q.id, {
        list,
        createdAt: q.createdAt,
        name: q.name,
        status: q.status,
        actions: {
          run: () => {
            list.next({
              context: this.getContext(),
            });
          },
          cancel: () => {
            list.cancel();
          },
          setStorage: (...args) => {
            list.setStorage(...args);
          },
          getStorage: () => {
            return list.getStorage();
          },
        },
      });

      list.initTasks({
        state: q.state,
        tasks: q.tasks,
        storage: q.storage || {},
      });

      if (q.status === Status.RUNNING) {
        console.log('[INIT] Try to resume');
        list.resume({
          context: this.getContext(),
        });
      }
    });
  }

  private makeList({
    queue_id,
    queue_name,
  }: {
    queue_id: QueueID;
    queue_name: QueueName;
  }) {
    const def = this.queuesDefs.get(queue_name)!;
    const list = new Queue({
      id: queue_id,
      events: {
        onCreate: (task) => {
          this.events.onCreateTask(queue_id, task);
          this.handleUpdate(queue_id);

          if (def.events?.onCreate) def.events.onCreate(task);
        },
        onUpdate: (task) => {
          this.events.onUpdateTask(queue_id, task);
          this.handleUpdate(queue_id);

          if (def.events?.onUpdate) def.events.onUpdate(task);
        },
        onUpdateListStatus: (status) => {
          this.queues.set(queue_id, {
            ...this.get(queue_id)!,
            status,
          });
          this.events.onUpdateQueue(queue_id, this.get(queue_id)!);

          this.handleUpdate(queue_id);

          // After finishing a queue, try to run other queues.
          this.run();
          if (def.events?.onUpdateListStatus)
            def.events.onUpdateListStatus(status);
        },
        onStorageUpdate: (data) => {
          this.events.onStorageUpdate(queue_id, data);
          if (def.events?.onStorageUpdate) def.events.onStorageUpdate(data);
          this.handleUpdate(queue_id);
        },
        onBlock: (event) => {
          // Update queue status
          this.queues.set(queue_id, {
            ...this.get(queue_id)!,
            status: Status.BLOCKED,
          });

          // Trigger event
          this.events.onTaskBlock(queue_id);
          if (def.whenTaskBlocked) {
            def.whenTaskBlocked(event, {
              queue_id: queue_id,
              queue: list,
              context: this.getContext(),
              getBlockedTasks: this.getBlockedTasks.bind(this),
              forceRun: this.forceRun.bind(this),
              retry: this.retry.bind(this),
            });
          }

          // Sync
          this.handleUpdate(queue_id);
        },
        onUnblock: () => {
          // Update queue status
          this.queues.set(queue_id, {
            ...this.get(queue_id)!,
            status: Status.PENDING,
          });

          // Sync
          this.handleUpdate(queue_id);

          this.run();
        },
      },
      actions: def.actions,
    });
    return list;
  }

  private getBlockedTasks() {
    const queues = this.getAll();
    const blockedTasks: BlockedTask[] = [];
    queues.forEach((q, queue_id) => {
      q.list.tasks.forEach((task) => {
        const state = q.list.state.tasks[task.id];
        if (state.status === Status.BLOCKED) {
          blockedTasks.push({
            task_id: task.id,
            queue_id: queue_id,
            action: task.action,
            reason: state.blockedFor,
            storage: {
              get: () => {
                return q.list.getStorage();
              },
              set: (data) => {
                return q.list.setStorage(data);
              },
            },
          });
        }
      });
    });

    return blockedTasks;
  }
  private makeQueue(id: QueueID, queue: QueueInfo) {
    this.queues.set(id, queue);
    const createdQueue = this.get(id)!;
    this.events.onCreateQueue({ ...createdQueue, id });

    return createdQueue;
  }

  // Create a new queue
  public async create(name: QueueName, storage: QueueStorage) {
    if (!this.queuesDefs.has(name)) {
      throw new Error('You need to add a queue definition first.');
    }

    const def = this.queuesDefs.get(name)!;
    const queue_id: QueueID = uuidv4();
    const createdAt = Date.now();
    const list = this.makeList({
      queue_id: queue_id,
      queue_name: name,
    });
    list.setStorage(storage);

    const createdQueue = this.makeQueue(queue_id, {
      list,
      createdAt,
      name,
      status: Status.PENDING,
      actions: {
        run: () => {
          list.next({
            context: this.getContext(),
          });
        },
        cancel: () => {
          list.cancel();
        },
        setStorage: (...args) => {
          list.setStorage(...args);
        },
        getStorage: () => {
          return list.getStorage();
        },
      },
    });

    // Persist initial queue
    // Note: we need to first insert the queue, and then it can be updated by internal events.
    await this.persistor.insertQueue({
      id: queue_id,
      createdAt,
      name: createdQueue.name,
      status: createdQueue.status,
      tasks: list.tasks,
      state: list.state,
      storage: list.getStorage(),
    });

    // adding initial tasks
    def.run.forEach((action) => {
      console.log('action', action);
      list.createTask(action);
    });

    // After creating a new queue, try to run.
    this.run();
    return queue_id;
  }

  public get(queue_id: QueueID) {
    return this.queues.get(queue_id);
  }
  public getAll() {
    return this.queues;
  }

  public run() {
    for (const [, q] of Array.from(this.queues)) {
      if (q.status === Status.PENDING) {
        console.log('There is a pending queue. Run it.');
        q.actions.run();
      }
    }

    console.log('There is no pending queue.');
  }

  public resume() {
    for (const [, q] of Array.from(this.queues)) {
      if (q.status === Status.RUNNING) {
        console.log("Found a running queue. Let's resume the queue.", q);
        q.list.resume({
          context: this.getContext(),
        });
        return;
      }
    }

    // If there is no running queue, try to run a new queue.
    this.run();
  }

  public retry() {
    for (const [, q] of Array.from(this.queues)) {
      if (q.status === Status.BLOCKED) {
        console.log("Found a blocked queue. Let's run onBlock callback.", q);
        q.list.checkBlock();
        return;
      }
    }

    // If there is no running queue, try to run a new queue.
    this.run();
  }

  public forceRun(queue_id: string, data?: object) {
    const queue = this.get(queue_id);
    let context = this.getContext();
    if (data) {
      context = {
        ...context,
        ...data,
      };
    }

    queue?.list.forceRun({
      context,
    });
  }

  private handleUpdate(queue_id: QueueID) {
    const queue = this.get(queue_id);

    if (queue) {
      const status = queue.status;
      const state = queue.list.state;
      const tasks = queue.list.tasks;
      this.persistor.updateQueue(queue_id, {
        status,
        state,
        tasks,
        storage: queue.list.getStorage(),
      });
    }
  }

  private getContext() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //@ts-ignore
    return this.context?.current || {};
  }
}

export { Manager };
