import type {
  AnyFunction,
  FunctionWithContext,
} from '../../namespaces/common/types.js';
import type { Actions, Context, SingleHookActions } from '../namespaces/mod.js';
import type { HookActions } from '../namespaces/types.js';

export function convertSingleHooksToActionsList<
  T extends Actions<T>,
  K extends keyof T
>(actions: SingleHookActions<T>) {
  const output: (readonly [K, FunctionWithContext<AnyFunction, Context>])[] =
    [];

  actions.forEach((action, name) => {
    output.push([name as K, action]);
  });

  return output;
}

export function convertHooksToActionsList<
  T extends Actions<T>,
  K extends keyof T
>(actions: HookActions<T>) {
  const output: (readonly [K, FunctionWithContext<AnyFunction, Context>[]])[] =
    [];

  actions.forEach((actions, name) => {
    output.push([name as K, actions]);
  });

  return output;
}
