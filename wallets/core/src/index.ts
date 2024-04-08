import * as CAIP from 'caip';

import { generateStoreId } from './hub';
import { common } from './namespaces/common';
import { evm } from './namespaces/evm';
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
  createStore,
  guessProviderStateSelector,
  namespaceStateSelector,
} from './hub';
export { NamespaceBuilder, ProviderBuilder } from './builders';
export type { NamespaceApi } from './builders';
export type { SolanaActions } from './namespaces/solana/types';
export type {
  EvmActions,
  NamespaceProvider as EvmNamespaceProvider,
} from './namespaces/evm/types';
export type { ProviderInfo } from './hub/store';
export { Namespaces } from './namespaces/common/types';

// TODO: It's better to use `esm exports in package.json` instead of scope them like this.
export const namespaces = {
  solana: solana,
  evm: evm,
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

// TODO: This may not be a good idea, because it may causes breaking changes.
export { CAIP };
