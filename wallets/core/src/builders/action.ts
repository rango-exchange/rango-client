import type { Actions, Context, Operators } from '../hub/namespaces/types.js';
import type { AnyFunction, FunctionWithContext } from '../types/actions.js';

export interface ActionByBuilder<T, Context> {
  actionName: keyof T;
  and: Operators<T>;
  or: Operators<T>;
  after: Operators<T>;
  before: Operators<T>;
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
  #and: Operators<T> = new Map();
  #or: Operators<T> = new Map();
  #after: Operators<T> = new Map();
  #before: Operators<T> = new Map();
  #action: FunctionWithContext<T[keyof T], Context<T>> | undefined;

  constructor(name: K) {
    this.name = name;
  }

  public and(action: FunctionWithContext<AnyFunction, Context<T>>) {
    if (!this.#and.has(this.name)) {
      this.#and.set(this.name, []);
    }
    this.#and.get(this.name)?.push(action);
    return this;
  }

  public or(action: FunctionWithContext<AnyFunction, Context<T>>) {
    if (!this.#or.has(this.name)) {
      this.#or.set(this.name, []);
    }
    this.#or.get(this.name)?.push(action);
    return this;
  }

  public before(action: FunctionWithContext<AnyFunction, Context<T>>) {
    if (!this.#before.has(this.name)) {
      this.#before.set(this.name, []);
    }
    this.#before.get(this.name)?.push(action);
    return this;
  }

  public after(action: FunctionWithContext<AnyFunction, Context<T>>) {
    if (!this.#after.has(this.name)) {
      this.#after.set(this.name, []);
    }
    this.#after.get(this.name)?.push(action);
    return this;
  }

  public action(action: FunctionWithContext<T[keyof T], Context<T>>) {
    this.#action = action;
    return this;
  }

  public build(): ActionByBuilder<T, Context<T>> {
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
