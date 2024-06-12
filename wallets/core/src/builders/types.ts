import type { allowedMethods } from './namespace.js';
import type { Namespace, SpecificMethods } from '../hub/namespace.js';

type PublicValues = {
  namespace: string;
};

export type NamespaceApi<T extends SpecificMethods<T>> = T &
  Pick<Namespace<T>, (typeof allowedMethods)[number]> &
  PublicValues;

export type NamespaceInterface<
  K extends keyof T,
  T
> = T[K] extends SpecificMethods<T[K]> ? NamespaceApi<T[K]> : never;
