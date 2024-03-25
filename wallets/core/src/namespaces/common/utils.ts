import type { Task, TaskWithVoidReturn } from './types';
import type { NamespaceApi } from '../../builders';
import type { SpecificMethods } from '../../hub/namespace';

const allowedApplyMethods = ['after', 'and', 'before'] as const;

export function apply<
  T extends SpecificMethods<T>,
  On extends (typeof allowedApplyMethods)[number]
>(
  on: On,
  list: On extends 'and'
    ? readonly Task<T>[]
    : readonly TaskWithVoidReturn<T>[],
  namespace: NamespaceApi<T>
): void {
  if (!allowedApplyMethods.includes(on)) {
    throw new Error(
      `"${on}" is not allowed to be applied. allowed: ${allowedApplyMethods.join(
        ', '
      )}`
    );
  }

  const fn = namespace[on as keyof NamespaceApi<T>];
  list.forEach(([name, cb]) => {
    fn(name, cb);
  });
}
