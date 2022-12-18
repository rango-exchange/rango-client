import { v4 as uuidv4 } from 'uuid';
import Persistor from './persistor';
import Queue, { QueueEventHandlers, TaskEvent } from './queue';
import { QueueContext, Status } from './types';

export type QueueName = string;
export type QueueID = string;

export type SetContext<T> = (nextContext: T) => T;

export interface ExecuterActions<T extends QueueContext = QueueContext> {
  next: () => void;
  failed: () => void;
  schedule: (actionName: string) => void;
  setContext: SetContext<T>;
  getContext: () => T;
}

export interface QueueDef<T extends QueueContext = QueueContext> {
  name: QueueName;
  actions: {
    [K in string]: (actions: ExecuterActions<T>) => void | Promise<void>;
  };
  events?: Partial<QueueEventHandlers>;
  run: string[];
}

interface Events {
  onCreateQueue: (queue: QueueInfo & { id: QueueID }) => void;
  onUpdateQueue: (queue_id: QueueID, queue: QueueInfo) => void;
  onCreateTask: (queue_id: QueueID, event: TaskEvent) => void;
  onUpdateTask: (queue_id: QueueID, event: TaskEvent) => void;
  onContextUpdate: (queue_id: QueueID, data: QueueContext) => void;
}

interface ManagerOptions {
  events?: Partial<Events>;
  queuesDefs: QueueDef[];
}

export interface QueueInfo {
  name: QueueName;
  status: Status;
  list: Queue;
  actions: {
    run: () => void;
    cancel: () => void;
    setContext: SetContext<any>;
    getContext: () => any;
  };
}

class Manager {
  private queuesDefs = new Map<QueueName, QueueDef>();
  private queues = new Map<QueueID, QueueInfo>();
  private events: Events;
  private persistor: Persistor;

  constructor(options: ManagerOptions) {
    const defaultEventHandlers = {
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
      onContextUpdate: () => {
        // ...
      },
    };

    if (options.events) {
      this.events = { ...defaultEventHandlers, ...options.events };
    } else {
      this.events = defaultEventHandlers;
    }

    options.queuesDefs.map((qDef) => {
      this.queuesDefs.set(qDef.name, qDef);
    });

    this.persistor = new Persistor();
    this.initQueuesFromPersistor();
  }

  private async initQueuesFromPersistor() {
    const queues = await this.persistor.getAll();

    queues.forEach((q: any) => {
      const list = this.makeList({
        queue_id: q.id,
        queue_name: q.name,
      });
      this.makeQueue(q.id, {
        list,
        name: q.name,
        status: q.status,
        actions: {
          run: () => {
            list.next();
          },
          cancel: () => {
            list.cancel();
          },
          setContext: (...args) => {
            list.setContext(...args);
          },
          getContext: () => {
            return list.getContext();
          },
        },
      });

      list.initTasks({
        state: q.tasksState,
        tasks: q.tasksList,
        context: q.context || {},
      });
    });

    // After loading queues from persistor, try to run.
    this.resume();
  }

  private makeList({ queue_id, queue_name }: { queue_id: QueueID; queue_name: QueueName }) {
    const def = this.queuesDefs.get(queue_name)!;

    const list = new Queue({
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
          console.log({ status, q: this.queues.get(queue_id) });
          this.events.onUpdateQueue(queue_id, this.get(queue_id)!);

          this.handleUpdate(queue_id);

          // After finishing a queue, try to run other queues.
          this.run();
          if (def.events?.onUpdateListStatus) def.events.onUpdateListStatus(status);
        },
        onContextUpdate: (data) => {
          this.events.onContextUpdate(queue_id, data);
          if (def.events?.onContextUpdate) def.events.onContextUpdate(data);
          this.handleUpdate(queue_id);
        },
      },
      actions: def.actions,
    });
    return list;
  }

  private makeQueue(id: QueueID, queue: QueueInfo) {
    this.queues.set(id, queue);
    const createdQueue = this.get(id)!;
    this.events.onCreateQueue({ ...createdQueue, id });

    return createdQueue;
  }

  // Create a new queue
  public async create(name: QueueName, context: QueueContext) {
    if (!this.queuesDefs.has(name)) {
      throw new Error('You need to add a queue definition first.');
    }

    const def = this.queuesDefs.get(name)!;
    const queue_id: QueueID = uuidv4();
    const list = this.makeList({
      queue_id: queue_id,
      queue_name: name,
    });
    list.setContext(context);

    const createdQueue = this.makeQueue(queue_id, {
      list,
      name,
      status: Status.PENDING,
      actions: {
        run: () => {
          list.next();
        },
        cancel: () => {
          list.cancel();
        },
        setContext: (...args) => {
          list.setContext(...args);
        },
        getContext: () => {
          return list.getContext();
        },
      },
    });

    // Persist initial queue
    // Note: we need to first insert the queue, and then it can be updated by internal events.
    await this.persistor.insertQueue({
      id: queue_id,
      name: createdQueue.name,
      status: createdQueue.status,
      tasksList: list.tasks,
      tasksState: list.state,
      context: list.getContext(),
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
      if (q.status === Status.RUNNING) {
        console.log('There is a running queue.');
        break;
      }

      if (q.status === Status.PENDING) {
        console.log('There is a pending queue. Run it.');
        q.actions.run();
        break;
      }
    }

    console.log('There is no pending queue.');
  }

  public resume() {
    for (const [, q] of Array.from(this.queues)) {
      if (q.status === Status.RUNNING) {
        console.log("Found a running queue. Let's resume the queue.", q);
        q.list.resume();
        return;
      }
    }

    // If there is no running queue, try to run a new queue.
    this.run();
  }

  private handleUpdate(queue_id: QueueID) {
    const queue = this.get(queue_id);

    if (queue) {
      const status = queue.status;
      const state = queue.list.state;
      const tasksList = queue.list.tasks;
      this.persistor.updateQueue(queue_id, {
        status,
        tasksState: state,
        tasksList,
        context: queue.list.getContext(),
      });
    }
  }
}

export { Manager };
