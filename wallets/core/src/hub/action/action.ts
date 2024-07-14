import type { NamespaceBuilder } from '../../mod.js';
import type { FunctionWithContext } from '../../namespaces/common/types.js';
import type {
  Actions,
  Context,
  HookActions,
  SingleHookActions,
} from '../namespaces/types.js';

import {
  convertHooksToActionsList,
  convertSingleHooksToActionsList,
} from './utils.js';

interface Hooks<T> {
  and: SingleHookActions<T>;
  or: SingleHookActions<T>;
  after: HookActions<T>;
  before: HookActions<T>;
}
export class Action<T extends Actions<T>, K extends keyof T> {
  readonly actionName: K;

  #hooks: Hooks<T> = {
    and: new Map(),
    or: new Map(),
    after: new Map(),
    before: new Map(),
  };
  #action: FunctionWithContext<T[keyof T], Context> | undefined;

  constructor(
    name: K,
    action: FunctionWithContext<T[keyof T], Context> | undefined,
    hooks: Hooks<T>
  ) {
    const { and, or, before, after } = hooks;

    this.actionName = name;
    this.#action = action;
    this.#hooks = {
      and,
      or,
      before,
      after,
    };
  }

  public action(action: FunctionWithContext<T[keyof T], Context>) {
    this.#action = action;
  }

  public toNamespace(namespaceBuilder: NamespaceBuilder<T>) {
    const ands = convertSingleHooksToActionsList(this.#hooks.and);
    const ors = convertSingleHooksToActionsList(this.#hooks.or);
    const befores = convertHooksToActionsList(this.#hooks.before);
    const afters = convertHooksToActionsList(this.#hooks.after);

    if (this.#action) {
      namespaceBuilder.action(this.actionName, this.#action);
    }

    namespaceBuilder.andUse(ands);
    namespaceBuilder.orUse(ors);
    namespaceBuilder.afterUse(afters);
    namespaceBuilder.beforeUse(befores);
  }
}
