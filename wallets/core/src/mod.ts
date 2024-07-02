export type { Store, State, ProviderInfo } from './hub/mod.js';
export {
  Hub,
  Provider,
  Namespace,
  createStore,
  guessProviderStateSelector,
  namespaceStateSelector,
} from './hub/mod.js';
export type {
  ProxiedNamespace,
  FindProxiedNamespace as NamespaceInterface,
} from './builders/mod.js';
export {
  NamespaceBuilder,
  ProviderBuilder,
  ActionBuilder,
} from './builders/mod.js';

/*
 * Our `embedded` hasn't been migrated to NodeNext yet so it doesn't support `exports` field.
 * There are two approach to make `NodeNext` which is used for our libs with old moduleResolution:
 *
 * 1. Use direct paths, e.g. '@rango-dev/wallets-core/dist/legacy/mod'
 * 2. Add types and function that are using in `embedded` to package entry point (this file).
 *
 * The first one is better since we don't need to deprecate or having a breaking change in future,
 * But Parcel has weird behavior on resolving ESM exports. We enabled exports for Parcel using `packageExports: true` option,
 * But it will use `exports` fields whenever it finds the field in package.json and ignore `moduleResolution` in tsconfig.
 *
 * To make it work for Parcel, we should go with second mentioned option.
 *
 */
export type { Versions } from './utils/mod.js';
export { defineVersions, pickVersion } from './utils/mod.js';

/*
 * All the exported types/values from legacy should be prefixed with `Legacy`
 * since they will be removed soon and isn't part of the main interface for this package.
 */
export type {
  EventHandler as LegacyEventHandler,
  LegacyProviderInterface,
  NamespaceAndNetwork as LegacyNamespaceAndNetwork,
} from './legacy/mod.js';
export {
  readAccountAddress as legacyReadAccountAddress,
  Events as LegacyEvents,
  Namespace as LegacyNamespace,
} from './legacy/mod.js';
