import type { AnyFunction, FunctionWithContext } from '../../types/actions.js';
import type { NamespaceData } from '../store/mod.js';

type ActionName<K> = K | Omit<K, string>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionResult = any;

export type Subscriber<C extends Actions<C>> = (
  context: Context<C>,
  ...args: Args
) => void;
export type SubscriberCleanUp<C extends Actions<C>> = (
  context: Context<C>,
  ...args: Args
) => void;
export type CanEagerConnect<C extends Actions<C>> = (
  context: Context<C>,
  ...args: Args
) => void;
export type State = NamespaceData;
export type SetState = <K extends keyof State>(
  name: K,
  value: State[K]
) => void;
export type GetState = {
  (): State;
  <K extends keyof State>(name: K): State[K];
};
export type RegisteredActions<T extends Actions<T>> = Map<
  ActionName<keyof T>,
  FunctionWithContext<T[keyof T], Context<T>>
>;

export type AndUseActions<T> = Map<keyof T, AnyFunction>;
export type Operators<T> = Map<keyof T, AnyFunction[]>;
export type HooksWithOptions<T> = Map<
  keyof T,
  {
    hook: AnyFunction;
    options?: {
      context?: unknown;
    };
  }[]
>;
export type Context<T extends Actions<T> = object> = {
  state: () => [GetState, SetState];
  action: (name: keyof T, ...args: Args) => ActionResult;
};

/**
 * This actually define what kind of action will be implemented in namespaces.
 * For example evm namespace will have .connect(chain: string) and .switchNetwork
 * But solana namespace only have: `.connect()`.
 * This actions will be passed to this generic.
 */
export type Actions<T> = Record<keyof T, AnyFunction>;
