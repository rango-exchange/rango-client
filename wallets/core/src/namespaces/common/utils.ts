import type { Task, TaskWithVoidReturn } from './types.js';
import type { ProxiedNamespace } from '../../builders/mod.js';
import type { Actions } from '../../hub/namespaces/mod.js';

const allowedApplyMethods = ['after', 'and', 'before'] as const;

export function apply<
  T extends Actions<T>,
  On extends (typeof allowedApplyMethods)[number]
>(
  on: On,
  list: On extends 'and'
    ? readonly Task<T>[]
    : readonly TaskWithVoidReturn<T>[],
  namespace: ProxiedNamespace<T>
): void {
  if (!allowedApplyMethods.includes(on)) {
    throw new Error(
      `"${on}" is not allowed to be applied. allowed: ${allowedApplyMethods.join(
        ', '
      )}`
    );
  }

  const fn = namespace[on as keyof ProxiedNamespace<T>];
  list.forEach(([name, cb]) => {
    fn(name, cb);
  });
}
