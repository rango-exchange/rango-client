import { v4 as uuidv4 } from 'uuid';
import { ManagerContext, QueueDef, QueueID } from './manager';
import { QueueStorage, Status } from './types';

type TaskId = string;
export type TaskState = {
  status: Status;
  blockedFor: any;
};

export interface QueueContext {
  _queue?: {
    id: string;
  };
}
export type NextParams = {
  context: ManagerContext;
};

export interface QueueState {
  status: Status;
  activeTaskIndex: number;
  tasks: {
    [key in TaskId]: TaskState;
  };
}

export interface Task {
  id: TaskId;
  action: string;
}

export type InitTasks = {
  tasks: Task[];
  state: QueueState;
  storage: QueueStorage;
};

export interface TaskEvent {
  id: TaskId;
  task: TaskState;
  action: string;
}

export interface QueueEventHandlers {
  // all tasks
  onUpdateListStatus: (status: Status) => void;
  // single task
  onCreate: (event: TaskEvent) => void;
  onUpdate: (event: TaskEvent) => void;
  onStorageUpdate: (data: QueueStorage) => void;
  onBlock: (
    data: Omit<TaskEvent, 'task'> & { reason: Record<string, unknown> }
  ) => void;
  onUnblock: (data: { id: string }) => void;
}

interface QueueOptions {
  id: QueueID;
  events: QueueEventHandlers;
  actions: QueueDef['actions'];
}

class Queue {
  public id: string;
  public state: QueueState = {
    status: Status.PENDING,
    activeTaskIndex: 0,
    tasks: {},
  };
  public tasks: Task[] = [];
  private events: QueueOptions['events'];
  private actions: QueueOptions['actions'];
  private storage: QueueStorage = {};

  constructor(options: QueueOptions) {
    this.id = options.id;
    this.events = options.events;
    this.actions = options.actions;
  }

  updateQueueStatus(status: Status) {
    this.state.status = status;
    this.events.onUpdateListStatus(status);
  }
  updateActiveTaskIndex(index: number) {
    this.state.activeTaskIndex = index;
  }

  updateTaskState(id: TaskId, nextState: Partial<TaskState>) {
    if (nextState.status) {
      this.state.tasks[id].status = nextState.status;
    }
    if (nextState.blockedFor) {
      this.state.tasks[id].blockedFor = nextState.blockedFor;
    }

    const updatedTaskEvent = {
      id: id,
      task: this.get(id)!,
      action: this.tasks.find((task) => task.id === id)!.action,
    };
    this.events.onUpdate(updatedTaskEvent);
  }

  createTask(action: string) {
    const id = uuidv4();
    this.tasks.push({
      action,
      id,
    });
    this.state.tasks[id] = {
      status: Status.PENDING,
      blockedFor: null,
    };

    const createdTask = this.get(id);
    this.events.onCreate({
      id,
      task: createdTask!,
      action,
    });
  }

  initTasks(info: InitTasks) {
    this.state = info.state;
    this.storage = info.storage;

    info.tasks.forEach((task) => {
      this.tasks.push(task);

      const taskState = info.state.tasks[task.id];
      const action = this.tasks.find((t) => t.id === task.id)!.action;
      this.events.onCreate({
        id: task.id,
        task: this.get(task.id)!,
        action,
      });

      if (taskState.status === Status.BLOCKED) {
        this.events.onBlock({
          action: action,
          id: task.id,
          reason: taskState.blockedFor,
        });
      }
    });
  }

  checkBlock() {
    const currentActiveTask = this.getActiveTask();

    if (!currentActiveTask) {
      return;
    }
    const { task, state } = currentActiveTask;

    if (state.status === Status.BLOCKED) {
      this.events.onBlock({
        action: task.action,
        id: task.id,
        reason: state.blockedFor,
      });
    }
  }

  get(id: string): TaskState | null {
    const task = this.state.tasks[id];

    if (!task) return null;

    return task;
  }

  lastTaskIsSuccessful() {
    const lastTask = this.tasks[this.tasks.length - 1];

    // checking for empty lists.
    if (lastTask) {
      const lastTaskState = this.state.tasks[lastTask.id];

      // Maybe we didn't create the state yet. It should has success status as well.
      if (!!lastTaskState && lastTaskState.status === Status.SUCCESS) {
        return true;
      }
    }

    return false;
  }

  firstTaskIsStarted() {
    const firstTask = this.tasks[0];

    // checking for empty lists.
    if (firstTask) {
      const firstTaskState = this.state.tasks[firstTask.id];

      // Maybe we didn't create the state yet.
      if (!!firstTaskState) {
        if (firstTaskState.status !== Status.PENDING) {
          return true;
        }
      }
    }

    return false;
  }

  getActiveTask() {
    // First try to get task with `activeTask`
    const index = this.state.activeTaskIndex;
    const task = this.tasks[index];

    // Consider all the tasks has been executed.
    if (!task) {
      return null;
    }

    const state = this.state.tasks[task.id];

    return { task, state, index };
  }

  // success = last task has success status.
  // failed = any of task has been failed.
  // running = first task is not on pending.
  // pending = default state. not started.

  // check tasks and update listState
  check() {
    const currentListStatus = this.state.status;
    let nextListStatus = this.firstTaskIsStarted()
      ? Status.RUNNING
      : Status.PENDING;

    if (this.lastTaskIsSuccessful()) {
      nextListStatus = Status.SUCCESS;
    } else {
      // Is there any failed task?
      for (const task of this.tasks) {
        const state = this.state.tasks[task.id];

        // If one item fails, we stop to work on the list.
        if (state.status === Status.FAILED) {
          nextListStatus = Status.FAILED;
          break;
        }
      }
    }

    // We only update and trigger an event when there is a new value
    if (nextListStatus !== currentListStatus) {
      this.updateQueueStatus(nextListStatus);
    }
  }

  next(params: NextParams) {
    console.log('[next]', this.state, params);

    this.check();

    const currentActiveTask = this.getActiveTask();

    if (!currentActiveTask) {
      return;
    }

    const {
      index: activeTaskIndex,
      task: activeTask,
      state: activeTaskState,
    } = currentActiveTask;

    // if `activeTask` is already done, we will go for next one.
    if (activeTaskState.status === Status.SUCCESS) {
      this.updateActiveTaskIndex(activeTaskIndex + 1);
      this.next(params);
      return;
    }

    if (activeTaskState.status === Status.FAILED) {
      console.log('Task has been failed. It can not be proceed.');
      return;
    }

    if (activeTaskState.status === Status.CANCELED) {
      console.log('Task has been canceled. It can not be proceed.');
      return;
    }

    if (activeTaskState.status === Status.RUNNING) {
      console.log('Task is running. It can not be proceed.');
      return;
    }

    if (
      activeTaskState.status === Status.PENDING ||
      activeTaskState.status === Status.BLOCKED
    ) {
      // Update task status to `running`
      this.updateTaskState(activeTask.id, {
        status: Status.RUNNING,
      });
      this.updateQueueStatus(Status.RUNNING);

      // Try to execute task.
      const execute = this.actions[activeTask.action];
      execute({
        context: this.getContext(params),
        next: () => {
          console.log('[execute][next]', params);
          this.markCurrentTaskAsFinished(params);
        },
        retry: () => {
          this.resume(params);
        },
        failed: () => {
          this.updateTaskState(activeTask.id, {
            status: Status.FAILED,
          });
          this.check();
        },
        schedule: (action) => {
          this.createTask(action);
          this.check();
        },
        getStorage: this.getStorage.bind(this),
        setStorage: this.setStorage.bind(this),
        // onCompleteTask: (cb) => {
        //   this.updateTaskStatusCallbacks.push(cb);
        // },
        block: (reason: Record<string, unknown>) => {
          this.block({ reason });
        },
        unblock: () => {
          this.unblock();
        },
      });
    }
  }

  block({ reason }: { reason: Record<string, unknown> }) {
    const currentActiveTask = this.getActiveTask();

    if (!currentActiveTask) {
      throw new Error("Task isn't exist.");
    }

    this.updateTaskState(currentActiveTask.task.id, {
      status: Status.BLOCKED,
      blockedFor: reason,
    });
    this.updateQueueStatus(Status.BLOCKED);
    this.events.onBlock({
      action: currentActiveTask.task.action,
      id: currentActiveTask.task.id,
      reason,
    });
  }

  unblock() {
    const currentActiveTask = this.getActiveTask();

    if (
      !currentActiveTask ||
      currentActiveTask.state.status !== Status.BLOCKED
    ) {
      throw new Error('Task is not blocked.');
    }

    this.updateTaskState(currentActiveTask.task.id, {
      status: Status.PENDING,
    });
    this.updateQueueStatus(Status.RUNNING);
    this.events.onUnblock({ id: currentActiveTask.task.id });
  }

  // Run a blocked task
  forceRun(params: NextParams) {
    const currentTask = this.getActiveTask();

    if (!currentTask || currentTask.state.status !== Status.BLOCKED) {
      throw new Error('Task is not blocked.');
    }

    // Try to execute task.
    const execute = this.actions[currentTask.task.action];
    execute({
      context: this.getContext(params),
      next: () => {
        console.log('[force run][execute][next]', params);

        /*
          NOTE:
            When running `forceRun`, the status of task can be `BLOCKED`
            So we need to change to `Running` first. 
        */
        // Update task status to `running`
        this.updateTaskState(currentTask.task.id, {
          status: Status.RUNNING,
        });
        this.updateQueueStatus(Status.RUNNING);

        this.markCurrentTaskAsFinished(params);
      },
      retry: () => {
        this.resume(params);
      },
      failed: () => {
        this.updateTaskState(currentTask.task.id, {
          status: Status.FAILED,
        });
        this.check();
      },
      schedule: (action) => {
        this.createTask(action);
        this.check();
      },
      getStorage: this.getStorage.bind(this),
      setStorage: this.setStorage.bind(this),
      block: (reason: Record<string, unknown>) => {
        this.block({ reason });
      },
      unblock: () => {
        this.unblock();
      },
    });
  }
  markCurrentTaskAsFinished(params: NextParams) {
    this.check();
    const activeTaskIndex = this.state.activeTaskIndex;
    const activeTask = this.tasks[activeTaskIndex];

    if (!activeTask) {
      console.log("It seems this queue has been finished. Task doesn't exist.");
      return;
    }

    const activeTaskState = this.state.tasks[activeTask.id];
    if (activeTaskState.status === Status.RUNNING) {
      this.updateTaskState(activeTask.id, {
        status: Status.SUCCESS,
      });
      this.updateActiveTaskIndex(activeTaskIndex + 1);

      const updatedTaskEvent = {
        id: activeTask.id,
        task: this.get(activeTask.id)!,
        action: this.tasks.find((task) => task.id === activeTask.id)!.action,
      };
      this.events.onUpdate(updatedTaskEvent);
      this.next(params);
    } else {
      console.log('There is no running task.');
    }
  }

  resume(params: NextParams) {
    // this.check();
    const activeTaskIndex = this.state.activeTaskIndex;
    const activeTask = this.tasks[activeTaskIndex];
    if (!activeTask) {
      console.log("It seems this queue has been finished. Task doesn't exist.");
      return;
    }

    const activeTaskState = this.state.tasks[activeTask.id];
    if (activeTaskState.status === Status.RUNNING) {
      this.updateTaskState(activeTask.id, {
        status: Status.PENDING,
      });
      this.next(params);
    } else {
      console.log('There is no running task. restart the queue', {
        state: this.state.tasks,
        activeTaskState,
        activeTask,
        activeTaskIndex,
      });
      this.resetState();
      this.next(params);
    }
  }

  cancel() {
    const currentActiveTask = this.getActiveTask();

    if (
      !currentActiveTask ||
      [Status.FAILED, Status.CANCELED, Status.SUCCESS].includes(
        currentActiveTask.state.status
      )
    ) {
      return;
    }

    const { task } = currentActiveTask;

    // Update task status to `canceled`
    this.updateTaskState(task.id, {
      status: Status.CANCELED,
    });
    const updatedTaskEvent = {
      id: task.id,
      task: this.get(task.id)!,
      action: this.tasks.find((t) => t.id === task.id)!.action,
    };
    this.events.onUpdate(updatedTaskEvent);

    // Update queue status to `canceled`
    this.updateQueueStatus(Status.CANCELED);
  }

  resetState() {
    this.state.activeTaskIndex = 0;
    this.state.status = Status.PENDING;
    Object.keys(this.state.tasks).forEach((id) => {
      this.state.tasks[id].status = Status.PENDING;
    });
  }

  getStorage() {
    return this.storage;
  }
  setStorage(data: QueueStorage) {
    this.storage = data;
    this.events.onStorageUpdate(data);
    return this.storage;
  }

  private getContext(params: NextParams): QueueContext & ManagerContext {
    return {
      ...params.context,
      _queue: {
        id: this.id,
      },
    };
  }
}

export default Queue;
