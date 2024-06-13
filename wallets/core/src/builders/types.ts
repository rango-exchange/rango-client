import type { allowedMethods } from './namespace.js';
import type { Actions, Namespace } from '../hub/namespace.js';

// These should be matched with `/hub/namespace.ts` public values.
type NamespacePublicValues = {
  namespaceId: string;
  providerId: string;
};

/**
 * NamespaceBuilder is creating a proxy instead of return Namespace instance.
 * The reason is improving access to actions. e.g `.connect()` instead of `.run('connect')`
 */
export type ProxiedNamespace<T extends Actions<T>> = T &
  Pick<Namespace<T>, (typeof allowedMethods)[number]> &
  NamespacePublicValues;

export type NamespaceInterface<K extends keyof T, T> = T[K] extends Actions<
  T[K]
>
  ? ProxiedNamespace<T[K]>
  : never;
