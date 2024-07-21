import type { Actions, Context, HookActions } from '../hub/namespaces/types.js';
import type {
  AnyFunction,
  FunctionWithContext,
} from '../namespaces/common/types.js';

export interface ActionByBuilder<T, Context> {
  actionName: keyof T;
  and: HookActions<T>;
  or: HookActions<T>;
  after: HookActions<T>;
  before: HookActions<T>;
  action: FunctionWithContext<T[keyof T], Context>;
}

/*
 * TODO:
 * Currently, to use this builder you will write something like this:
 * new ActionBuilder<EvmActions, 'disconnect'>('disconnect').after(....)
 *
 * I couldn't figure it out to be able typescript infer the constructor value as key of actions.
 * Ideal usage:
 * new ActionBuilder<EvmActions>('disconnect').after(....)
 *
 */
export class ActionBuilder<T extends Actions<T>, K extends keyof T> {
  readonly name: K;
  #and: HookActions<T> = new Map();
  #or: HookActions<T> = new Map();
  #after: HookActions<T> = new Map();
  #before: HookActions<T> = new Map();
  #action: FunctionWithContext<T[keyof T], Context> | undefined;

  constructor(name: K) {
    this.name = name;
  }

  public and(action: FunctionWithContext<AnyFunction, Context>) {
    if (!this.#and.has(this.name)) {
      this.#and.set(this.name, []);
    }
    this.#and.get(this.name)?.push(action);
    return this;
  }

  public or(action: FunctionWithContext<AnyFunction, Context>) {
    if (!this.#or.has(this.name)) {
      this.#or.set(this.name, []);
    }
    this.#or.get(this.name)?.push(action);
    return this;
  }

  public before(action: FunctionWithContext<AnyFunction, Context>) {
    if (!this.#before.has(this.name)) {
      this.#before.set(this.name, []);
    }
    this.#before.get(this.name)?.push(action);
    return this;
  }

  public after(action: FunctionWithContext<AnyFunction, Context>) {
    if (!this.#after.has(this.name)) {
      this.#after.set(this.name, []);
    }
    this.#after.get(this.name)?.push(action);
    return this;
  }

  public action(action: FunctionWithContext<T[keyof T], Context>) {
    this.#action = action;
    return this;
  }

  public build(): ActionByBuilder<T, Context> {
    if (!this.#action) {
      throw new Error('Your action builder should includes an action.');
    }

    return {
      actionName: this.name,
      action: this.#action,
      before: this.#before,
      after: this.#after,
      and: this.#and,
      or: this.#or,
    };
  }
}
