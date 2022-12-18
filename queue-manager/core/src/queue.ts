import { v4 as uuidv4 } from 'uuid';
import { QueueDef } from './manager';
import { QueueContext, Status } from './types';

type TaskId = string;
export type TaskState = Status;

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
  context: QueueContext;
};

export interface TaskEvent {
  id: TaskId;
  task: TaskState;
}

export interface QueueEventHandlers {
  // all tasks
  onUpdateListStatus: (status: Status) => void;
  // single task
  onCreate: (event: TaskEvent) => void;
  onUpdate: (event: TaskEvent) => void;
  onContextUpdate: (data: QueueContext) => void;
}

interface QueueOptions {
  events: QueueEventHandlers;
  actions: QueueDef['actions'];
}

class Queue {
  public state: QueueState = {
    status: Status.PENDING,
    activeTaskIndex: 0,
    tasks: {},
  };
  public tasks: Task[] = [];
  private events: QueueOptions['events'];
  private actions: QueueOptions['actions'];
  private context: QueueContext = {};

  constructor(options: QueueOptions) {
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

  updateTaskStatus(id: TaskId, status: Status) {
    this.state.tasks[id] = status;

    const updatedTaskEvent = {
      id: id,
      task: this.get(id)!,
    };
    this.events.onUpdate(updatedTaskEvent);
  }

  createTask(action: string) {
    const id = uuidv4();
    this.tasks.push({
      action,
      id,
    });
    this.state.tasks[id] = Status.PENDING;

    const createdTask = this.get(id);
    this.events.onCreate({
      id,
      task: createdTask!,
    });
  }

  initTasks(info: InitTasks) {
    this.state = info.state;
    this.context = info.context;

    info.tasks.forEach((task) => {
      this.tasks.push(task);
      this.events.onCreate({
        id: task.id,
        task: this.get(task.id)!,
      });
    });
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
      if (!!lastTaskState && lastTaskState === Status.SUCCESS) {
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
        if (firstTaskState !== Status.PENDING) {
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
    let nextListStatus = this.firstTaskIsStarted() ? Status.RUNNING : Status.PENDING;

    if (this.lastTaskIsSuccessful()) {
      nextListStatus = Status.SUCCESS;
    } else {
      // Is there any failed task?
      for (const task of this.tasks) {
        const status = this.state.tasks[task.id];

        // If one item fails, we stop to work on the list.
        if (status === Status.FAILED) {
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

  next() {
    this.check();

    const currentActiveTask = this.getActiveTask();

    if (!currentActiveTask) {
      return;
    }

    const { index: activeTaskIndex, task: activeTask, state: activeTaskState } = currentActiveTask;

    // if `activeTask` is already done, we will go for next one.
    if (activeTaskState === Status.SUCCESS) {
      this.updateActiveTaskIndex(activeTaskIndex + 1);
      this.next();
      return;
    }

    if (activeTaskState === Status.FAILED) {
      console.log('Task has been failed. It can not be proceed.');
      return;
    }

    if (activeTaskState === Status.CANCELED) {
      console.log('Task has been canceled. It can not be proceed.');
      return;
    }

    if (activeTaskState === Status.RUNNING) {
      console.log('Task is running. It can not be proceed.');
      return;
    }

    if (activeTaskState === Status.PENDING) {
      // Update task status to `running`
      this.updateTaskStatus(activeTask.id, Status.RUNNING);
      this.updateQueueStatus(Status.RUNNING);

      // Try to execute task.
      const execute = this.actions[activeTask.action];
      execute({
        next: () => {
          this.markCurrentTaskAsFinished();
        },
        failed: () => {
          this.updateTaskStatus(activeTask.id, Status.FAILED);
          this.check();
        },
        schedule: (action) => {
          this.createTask(action);
          this.check();
        },
        getContext: this.getContext.bind(this),
        setContext: this.setContext.bind(this),
      });
    }
  }

  markCurrentTaskAsFinished() {
    this.check();
    const activeTaskIndex = this.state.activeTaskIndex;
    const activeTask = this.tasks[activeTaskIndex];

    if (!activeTask) {
      console.log("It seems this queue has been finished. Task doesn't exist.");
      return;
    }

    const activeTaskState = this.state.tasks[activeTask.id];
    if (activeTaskState === Status.RUNNING) {
      this.updateTaskStatus(activeTask.id, Status.SUCCESS);
      this.updateActiveTaskIndex(activeTaskIndex + 1);

      const updatedTaskEvent = {
        id: activeTask.id,
        task: this.get(activeTask.id)!,
      };
      this.events.onUpdate(updatedTaskEvent);
      this.next();
    } else {
      console.log('There is no running task.');
    }
  }

  resume() {
    // this.check();
    const activeTaskIndex = this.state.activeTaskIndex;
    const activeTask = this.tasks[activeTaskIndex];

    if (!activeTask) {
      console.log("It seems this queue has been finished. Task doesn't exist.");
      return;
    }

    const activeTaskState = this.state.tasks[activeTask.id];
    if (activeTaskState === Status.RUNNING) {
      this.updateTaskStatus(activeTask.id, Status.PENDING);
      this.next();
    } else {
      console.log('There is no running task. restart the queue', {
        state: this.state.tasks,
        activeTaskState,
        activeTask,
        activeTaskIndex,
      });
      this.resetState();
      this.next();
    }
  }

  cancel() {
    const currentActiveTask = this.getActiveTask();

    if (
      !currentActiveTask ||
      [Status.FAILED, Status.CANCELED, Status.SUCCESS].includes(currentActiveTask.state)
    ) {
      return;
    }

    const { task } = currentActiveTask;

    // Update task status to `canceled`
    this.updateTaskStatus(task.id, Status.CANCELED);
    const updatedTaskEvent = {
      id: task.id,
      task: this.get(task.id)!,
    };
    this.events.onUpdate(updatedTaskEvent);

    // Update queue status to `canceled`
    this.updateQueueStatus(Status.CANCELED);
  }

  resetState() {
    this.state.activeTaskIndex = 0;
    this.state.status = Status.PENDING;
    Object.keys(this.state.tasks).forEach((id) => {
      this.state.tasks[id] = Status.PENDING;
    });
  }

  getContext() {
    return this.context;
  }
  setContext(data: QueueContext) {
    this.context = data;
    this.events.onContextUpdate(data);
    return this.context;
  }
}

export default Queue;
