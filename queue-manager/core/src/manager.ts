import Persistor from './persistor';
import Queue, { QueueEventHandlers, TaskEvent } from './queue';
import { QueueStorage, Status } from './types';
import { v4 as uuidv4 } from 'uuid';

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
      forceExecute: (queue_id: string, data?: object) => void;
      retry: () => void;
      manager: Manager;
    }
  ) => void;
}

export interface Events {
  onCreateQueue: (queue: QueueInfo & { id: QueueID }) => void;
  onUpdateQueue: (queue_id: QueueID, queue: QueueInfo) => void;
  onCreateTask: (queue_id: QueueID, event: TaskEvent) => void;
  onUpdateTask: (queue_id: QueueID, event: TaskEvent) => void;
  onStorageUpdate: (queue_id: QueueID, data: QueueStorage) => void;
  onTaskBlock: (queue_id: QueueID) => void;
  onPersistedDataLoaded: (manager: Manager) => void;
}

interface ManagerOptions {
  events?: Partial<Events>;
  queuesDefs: QueueDef[];
  context?: ManagerContext;
  isPaused?: boolean;
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
  private isPaused: boolean = false;

  /**
   *
   * Making an instance, initilize events, setup a persistor and try to recover the last state of the manager.
   *
   * */
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
      onPersistedDataLoaded: () => {
        // ..
      },
    };

    if (options.events) {
      this.events = {
        ...defaultEventHandlers,
        ...options.events,
      };
    } else {
      this.events = defaultEventHandlers;
    }

    options.queuesDefs.map((qDef) => {
      this.queuesDefs.set(qDef.name, qDef);
    });

    this.context = options.context || {};
    this.persistor = new Persistor();
    this.sync();

    if (options.isPaused) {
      this.pause();
    }
  }

  /**
   *
   * Reading persisted data from storage then brings into memory.
   *
   * Notes:
   *  - Reset the memory, so we can call this method whenever we want and not only on the initialize process.
   *  - All the events will be tirggered (like onCreateQueue, onCreateTask, onBlock, ....)
   *  - Try to `resume` if the status is `running`.
   *  - Trigger `onPersistedDataLoaded` event when queues recovered from storage.
   *
   */
  private async sync() {
    // Reading queues from storage
    const queues = await this.persistor.getAll();

    // Reset queues, if anything is exist in memory.
    this.queues = new Map();

    // Brings them into memory
    queues.forEach((q) => {
      const list = this.createQueue({
        queue_id: q.id,
        queue_name: q.name,
      });
      this.add(q.id, {
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

      if (q.status === Status.RUNNING && this.shouldExecute()) {
        console.log('[INIT] Try to resume');
        list.resume({
          context: this.getContext(),
        });
      }
    });

    // Trigger an event to let the subscribers we are done here.
    this.events.onPersistedDataLoaded(this);
  }

  /**
   *
   * Making a new instance from `Queue` and adds Manager's event handlers to it.
   *
   * @returns An instance of `Queue` with wrapped event handlers from Manager.
   *
   */
  private createQueue({
    queue_id,
    queue_name,
  }: {
    queue_id: QueueID;
    queue_name: QueueName;
  }) {
    const manager = this;
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
          this.execute();
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
              forceExecute: this.forceExecute.bind(this),
              retry: this.retry.bind(this),
              manager,
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

          this.execute();
        },
      },
      actions: def.actions,
    });
    return list;
  }

  /**
   * Go through all tasks (from all queues) and return a list of blocked tasks
   *
   * @returns a list of blocked tasks including enough information to get the queue and mutate the storage.
   *
   */
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

  /**
   *
   * Add a queue to the manager to keep track of the queue and its state.
   *
   * @param id
   * @param queue
   * @returns
   */
  private add(id: QueueID, queue: QueueInfo) {
    this.queues.set(id, queue);
    const createdQueue = this.get(id)!;
    this.events.onCreateQueue({ ...createdQueue, id });

    return createdQueue;
  }

  // Create a new queue
  /**
   *
   * Create a new queue by client.
   *
   * It will do the internal things to make a queue from definitions, and running using Manager.
   *
   * Notes:
   *  - After creating the queue, it will be run automatically.
   *
   * @returns an ID for queue so it can be used to get the created queue later by client.
   *
   */
  public async create(
    name: QueueName,
    storage: QueueStorage,
    options?: { id?: QueueID }
  ) {
    if (!this.queuesDefs.has(name)) {
      throw new Error('You need to add a queue definition first.');
    }
    const def = this.queuesDefs.get(name)!;
    const queue_id: QueueID = options?.id || uuidv4();
    const createdAt = Date.now();
    const list = this.createQueue({
      queue_id: queue_id,
      queue_name: name,
    });
    list.setStorage(storage);

    const createdQueue = this.add(queue_id, {
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
    this.execute();
    return queue_id;
  }

  /**
   * Get a queue by its ID.
   *
   * @returns An object includes queue and its state in `Manager`.
   */
  public get(queue_id: QueueID) {
    return this.queues.get(queue_id);
  }

  /**
   * Get all queues from `Manager`
   *
   * @returns a list of queues includes all the queues and their states.
   */
  public getAll() {
    return this.queues;
  }

  /**
   *
   * Ask from manager to run pending queues.
   *
   * It only try to run queues with `PENDING` status and ignore all the other statuses.
   *
   */
  public execute() {
    if (!this.shouldExecute()) return;

    for (const [, q] of Array.from(this.queues)) {
      if (q.status === Status.PENDING) {
        console.log('There is a pending queue. Run it.');
        q.actions.run();
      }
    }

    console.log('There is no pending queue.');
  }

  /**
   *
   * Try to find queues with `RUNNING` status to run them again.
   *
   * It's useful for recovering the queue at some certain points
   * like running a currepted task (reloaded when it was running) or needs manual trigger from UI.
   *
   * @returns
   */
  public resume() {
    if (!this.shouldExecute()) return;

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
    this.execute();
  }

  /**
   *
   * Run all `BLOCKED` queues once again.
   *
   * If a queue has `BLOCKED` status and the last task is `BLOCKED` as well,
   * The task will be run one more time.
   *
   * Useful for scenarios like we are blocking the queue under some conditions in task,
   * We can use this method to ask the queue to run the blocked task one more time and
   * maybe this time condtions are met and the queue can be proceed.
   *
   * @returns
   */
  public retry() {
    if (!this.shouldExecute()) return;

    for (const [, q] of Array.from(this.queues)) {
      if (q.status === Status.BLOCKED) {
        console.log(
          `[Retry] Found: ${q.list.id}, Running onBlock callback.`,
          q
        );
        q.list.checkBlock();
      }
    }

    // If there is no running queue, try to run a new queue.
    this.execute();
  }

  /**
   *
   * Run a blocked task on a specific queue with the ability to pass more data.
   *
   * Useful when we have a custom logic for running queue and needs to pass some specific data
   * to the task and try to run it manually with the provided data.
   *
   */
  public forceExecute(queue_id: string, data?: object) {
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

  /**
   *
   * Sync in-memory state (of `Manager`) with storage (persist).
   *
   * Usually we call this method after a change detected in the state of manager.
   *
   */
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

  /**
   * Active readonly mode for manager, it means it doesn't run anythin,
   * And only can be used to read the data.
   */
  public pause() {
    this.isPaused = true;
  }

  /**
   * Activate normal mode which means it will be able to run the queuese as well.
   */
  public run() {
    // If call this method multiple times, it should be run for once.
    if (this.isPaused) {
      this.isPaused = false;
      this.sync();
    }
  }

  private getContext() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //@ts-ignore
    return this.context?.current || {};
  }

  private shouldExecute() {
    console.log('[shouldExecute] checking and result is:', {
      isPaused: this.isPaused,
    });
    return !this.isPaused;
  }
}

export { Manager };
