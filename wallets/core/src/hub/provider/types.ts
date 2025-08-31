import type { FindProxiedNamespace } from '../../builders/mod.js';
import type { Store } from '../../hub/mod.js';
import type { LegacyState } from '../../legacy/mod.js';
import type { CosmosActions } from '../../namespaces/cosmos/mod.js';
import type { EvmActions } from '../../namespaces/evm/mod.js';
import type { SolanaActions } from '../../namespaces/solana/mod.js';
import type { SuiActions } from '../../namespaces/sui/mod.js';
import type { UtxoActions } from '../../namespaces/utxo/mod.js';
import type { AnyFunction, FunctionWithContext } from '../../types/actions.js';
import type { Prettify } from '../../types/utils.js';

export type Context = {
  state: () => [GetState, SetState];
};

export type State = Omit<
  LegacyState,
  'reachable' | 'accounts' | 'network' | 'derivationPath'
>;
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
  sui: SuiActions;
  utxo: UtxoActions;
}

export type CommonNamespaceKeys = Prettify<keyof CommonNamespaces>;

export interface ExtendableInternalActions {
  init?: FunctionWithContext<AnyFunction, Context>;
}

export type RegisteredNamespaces<K extends keyof T, T> = Map<
  K,
  FindProxiedNamespace<K, T>
>;

export type ProviderBuilderOptions = { store?: Store };
export type GenerateDeepLink = (context: DeepLinkContext) => string;

/**
 * Deeplink parameters context.
 *
 * @param targetUrl - URL of the widget in the app to be opened in the in-app browser.
 * @param appHost - Domain of the app where the widget has been implemented.
 */
export type DeepLinkContext = {
  targetUrl: string;
  appHost: string;
};
