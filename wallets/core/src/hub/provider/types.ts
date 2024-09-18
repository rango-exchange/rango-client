import type { LegacyState } from '../../legacy/mod.js';
import type { NamespaceInterface, Store } from '../../mod.js';
import type { CosmosActions } from '../../namespaces/cosmos/mod.js';
import type { EvmActions } from '../../namespaces/evm/mod.js';
import type { SolanaActions } from '../../namespaces/solana/mod.js';
import type { AnyFunction, FunctionWithContext } from '../../types/actions.js';

export type Context = {
  state: () => [GetState, SetState];
};

export type State = Omit<LegacyState, 'reachable' | 'accounts' | 'network'>;
export type SetState = <K extends keyof Pick<State, 'installed'>>(
  name: K,
  value: State[K]
) => void;
export type GetState = {
  (): State;
  <K extends keyof State>(name: K): State[K];
};

export interface CommonNamespaces {
  evm: EvmActions;
  solana: SolanaActions;
  cosmos: CosmosActions;
}

export interface ExtendableInternalActions {
  init?: FunctionWithContext<AnyFunction, Context>;
}

export type RegisteredNamespaces<K extends keyof T, T> = Map<
  K,
  NamespaceInterface<K, T>
>;

export type ProviderBuilderOptions = { store?: Store };
