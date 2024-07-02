import type {
  Actions,
  Context,
  HookActions,
  SingleHookActions,
} from '../hub/namespaces/types.js';
import type {
  AndFunction,
  AnyFunction,
  FunctionWithContext,
} from '../namespaces/common/types.js';

import { Action } from '../hub/action/mod.js';

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
  #and: SingleHookActions<T> = new Map();
  #or: SingleHookActions<T> = new Map();
  #after: HookActions<T> = new Map();
  #before: HookActions<T> = new Map();
  #action: FunctionWithContext<T[keyof T], Context> | undefined;

  constructor(name: K) {
    this.name = name;
  }

  public and(action: FunctionWithContext<AndFunction<T, K>, Context>) {
    this.#and.set(this.name, action);
    return this;
  }

  public or(action: FunctionWithContext<AnyFunction, Context>) {
    this.#or.set(this.name, action);
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

  public build() {
    return new Action<T, K>(this.name, this.#action, {
      after: this.#after,
      before: this.#before,
      and: this.#and,
      or: this.#or,
    });
  }
}
