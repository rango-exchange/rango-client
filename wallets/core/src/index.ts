import { common } from './namespaces/common';
import { solana } from './namespaces/solana';

export type { EventHandler, State, Options } from './v0/wallet';
export * from './v0/types';

export { Persistor } from './v0/persistor';
export * from './v0/helpers';
export { default } from './v0/wallet';

export type { Store } from './hub';
export {
  Hub,
  Provider,
  Namespace,
  solana as solanaUse,
  evm as evmUse,
  createStore,
} from './hub';
export { NamespaceBuilder, ProviderBuilder } from './builders';
export type { NamespaceApi } from './builders';
export type { SolanaActions } from './actions/solana/interface';
export type { EvmActions } from './actions/evm/interface';

// TODO: It's better to use `esm exports in package.json` instead of scope them like this.
export const namespaces = {
  solana: solana,
  common: common,
};
