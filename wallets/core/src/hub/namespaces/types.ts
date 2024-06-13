import type {
  AnyFunction,
  FunctionWithContext,
} from '../../namespaces/common/types.js';
import type { NamespaceData } from '../store/mod.js';

type ActionName<K> = K | Omit<K, string>;

export type Subscriber = (context: Context) => () => void;
export type State = NamespaceData;
export type SetState = <K extends keyof State>(
  name: K,
  value: State[K]
) => void;
export type GetState = {
  (): State;
  <K extends keyof State>(name: K): State[K];
};
export type ActionsMap<T> = Map<
  ActionName<keyof T>,
  FunctionWithContext<T[keyof T], Context>
>;

export type AndUseActions<T> = Map<keyof T, AnyFunction>;
export type Context = {
  state: () => [GetState, SetState];
};

/**
 * This actually define what kind of action will be implemented in namespaces.
 * For example evm namespace will have .connect(chain: string) and .switchNetwork
 * But solana namespace only have: `.connect()`.
 * This actions will be passed to this generic.
 */
export type Actions<T> = Record<keyof T, AnyFunction>;
