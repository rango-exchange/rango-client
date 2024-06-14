import type { LegacyState } from '../../legacy/wallet.js';
import type { NamespaceInterface, Store } from '../../mod.js';
import type {
  AnyFunction,
  FunctionWithContext,
} from '../../namespaces/common/types.js';
import type { CosmosActions } from '../../namespaces/cosmos/types.js';
import type { EvmActions } from '../../namespaces/evm/types.js';
import type { SolanaActions } from '../../namespaces/solana/types.js';

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

export type NamespacesMap<K extends keyof T, T> = Map<
  K,
  NamespaceInterface<K, T>
>;

export type ProviderBuilderOptions = { store?: Store };
