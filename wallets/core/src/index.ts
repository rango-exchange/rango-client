import { generateStoreId } from './hub';
import { common } from './namespaces/common';
import { solana } from './namespaces/solana';

export type { EventHandler, LegacyState, Options } from './legacy/wallet';
export * from './legacy/types';

export { Persistor } from './legacy/persistor';
export * from './legacy/helpers';
export { default } from './legacy/wallet';

export type { Store, State } from './hub';
export {
  Hub,
  Provider,
  Namespace,
  solana as solanaUse,
  evm as evmUse,
  createStore,
  guessProviderStateSelector,
  namespaceStateSelector,
} from './hub';
export { NamespaceBuilder, ProviderBuilder } from './builders';
export type { NamespaceApi } from './builders';
export type { SolanaActions } from './namespaces/solana/types';
export type { EvmActions } from './namespaces/evm/types';

// TODO: It's better to use `esm exports in package.json` instead of scope them like this.
export const namespaces = {
  solana: solana,
  common: common,
};

export const helpers = {
  generateStoreId,
};

export {
  pickVersion,
  defineVersions,
  legacyProviderImportsToVersionsInterface,
} from './versions';
export type { VLegacy, V1, Versions } from './versions';
