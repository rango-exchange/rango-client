/*
 * All the exported types/values from legacy should be prefixed with `Legacy`
 * since they will be removed soon and isn't part of the main interface for this package.
 */
export type {
  EventHandler as LegacyEventHandler,
  State as LegacyState,
  Options as LegacyOptions,
} from './wallet.js';

export type {
  Connect as LegacyConnect,
  Disconnect as LegacyDisconnect,
  Subscribe as LegacySubscribe,
  CanEagerConnect as LegacyCanEagerConnect,
  SwitchNetwork as LegacySwitchNetwork,
  Suggest as LegacySuggest,
  CanSwitchNetwork as LegacyCanSwitchNetwork,
  GenerateDeepLink,
  NamespaceData as LegacyNamespaceData,
  ProviderInterface as LegacyProviderInterface,
  Network as LegacyNetwork,
  WalletType as LegacyWalletType,
  InstallObjects as LegacyInstallObjects,
  WalletInfo as LegacyWalletInfo,
  ConnectResult as LegacyConnectResult,
  NamespaceInputForConnect as LegacyNamespaceInputForConnect,
  NamespaceMeta as LegacyNamespaceMeta,
} from './types.js';

export { Events as LegacyEvents, Networks as LegacyNetworks } from './types.js';

export { Persistor } from './persistor.js';
export {
  readAccountAddress as legacyReadAccountAddress,
  getBlockChainNameFromId as legacyGetBlockChainNameFromId,
  formatAddressWithNetwork as legacyFormatAddressWithNetwork,
} from './helpers.js';
export { default as LegacyWallet } from './wallet.js';

export {
  eagerConnectHandler as legacyEagerConnectHandler,
  isEvmNamespace as legacyIsEvmNamespace,
} from './utils.js';
