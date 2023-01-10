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

/**
 *
 * Notes on statuses:
 *  - Success: last task has success status
 *  - Failed: any of task has been failed
 *  - Running: first task is not on pending
 *  - Pending: default state. not started
 *
 */
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

  /**
   * Update queue status and trigger an event
   *
   */
  private updateQueueStatus(status: Status) {
    this.state.status = status;
    this.events.onUpdateListStatus(status);
  }

  private updateActiveTaskIndex(index: number) {
    this.state.activeTaskIndex = index;
  }

  /**
   *
   * Update task state (`status`, `blockedFor`) and trigger an event.
   * @param id
   * @param nextState
   */
  private updateTaskState(id: TaskId, nextState: Partial<TaskState>) {
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

  /**
   * Create a task by providing an `action` name.
   *
   * this method creating the task, push it to the queue's tasks and trigger an event.
   * @param action
   */
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

  /**
   * Initilize a queue with some tasks, instead of an empty queue.
   *
   * Using it for recover the queue state from persistor.
   *
   */
  public initTasks(info: InitTasks) {
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

  public checkBlock() {
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

  /**
   * Getting task state by ID
   */
  public get(id: string): TaskState | null {
    const task = this.state.tasks[id];

    if (!task) return null;

    return task;
  }

  /**
   *
   * Checking if status of the last is `SUCCESS` or not
   *
   */
  private lastTaskIsSuccessful() {
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

  /**
   * If the first task started (it's not PENDING),
   * it means the queue has been ran.
   *
   * @returns
   */
  private firstTaskIsStarted() {
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

  /**
   * Getting active task index from state and
   * returns the task and its state.
   *
   */
  private getActiveTask() {
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

  /**
   * Update and find the queue status by checking state of each tasks in the queue.
   */
  public check() {
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

  /**
   * Execute active task.
   * Based on the state of active task, the behaviour is different. If status is:
   *  - Success -> we need to go to next task by updating the active index and try `next` on more time.
   *  - Failed, Running, or no active task -> doesn't do anything.
   *  - Pending or Blocked -> update the task and queue status to running, and execute the provided `action` for the task.
   *
   * The queue is a linked list somehow, active task means the pointer to where we are in the queue right now.
   *
   */
  public next(params: NextParams) {
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
        block: (reason: Record<string, unknown>) => {
          this.block({ reason });
        },
        unblock: () => {
          this.unblock();
        },
      });
    }
  }

  /**
   * Change the `status` of active task and queue to BLOCKED, then trigger an event.
   */
  public block({ reason }: { reason: Record<string, unknown> }) {
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

  /**
   * If the active task is `BLOCKED`, update the task status to `PENDING`, queue status to `RUNNING`
   * then trigger an event.
   */
  public unblock() {
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

  /**
   * If the active task is `BLOCKED` then execute the `action` for the task.
   *
   * It is useful for when we need to run a blocked task without changing the status of task at the first place.
   * For scenarios like we have some conditions in `action` and needs to run the `action` again
   * to check the conditions are met or not, if yes, so we can proceed the `action`.
   *
   */
  public forceRun(params: NextParams) {
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
  private markCurrentTaskAsFinished(params: NextParams) {
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

  /**
   * If the active task is `RUNNING`, change it to `PENING` the try to run the task by calling `next`.
   * If it's other than `RUNNING` we reset the queue state and run the queue from the beggining.
   *
   * @param params
   * @returns
   */
  public resume(params: NextParams) {
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

  /**
   *
   * Cancel the queue by changing active task and queue status to `CANCELED`.
   *
   */
  public cancel() {
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

  /**
   * Update queue status, and all the tasks inside queue to `PENDING`.
   */
  private resetState() {
    this.state.activeTaskIndex = 0;
    this.state.status = Status.PENDING;
    Object.keys(this.state.tasks).forEach((id) => {
      this.state.tasks[id].status = Status.PENDING;
    });
  }

  public getStorage() {
    return this.storage;
  }
  public setStorage(data: QueueStorage) {
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
