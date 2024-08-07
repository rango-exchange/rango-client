import type { allowedMethods } from './namespace.js';
import type { Actions, Namespace } from '../hub/namespaces/mod.js';

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

/**
 * This is useful when you gave a list of namespaces and want to map a key to corresponding namespace.
 *
 * e.g:
 * Type List = { evm: EvmActions, solana: SolanaActions};
 * FindProxiedNamespace<"solana", List>
 */
export type FindProxiedNamespace<K extends keyof T, T> = T[K] extends Actions<
  T[K]
>
  ? ProxiedNamespace<T[K]>
  : never;
