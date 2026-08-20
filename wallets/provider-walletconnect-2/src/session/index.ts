export {
  type Bip122AddressEntry,
  filterBip122Accounts,
  getBip122AccountsFromSession,
  patchBip122SessionAccount,
  pickPaymentAddress,
  resolveBip122Session,
} from './bip122.js';
export {
  filterEvmAccounts,
  getCurrentEvmAccountAddress,
  getEvmAccount,
  ignoreNamespaceMethods,
  switchOrAddEvmChain,
  updateSessionAccounts,
} from './evm.js';
export { getAccountsFromEvent, getAccountsFromSession } from './accounts.js';
export {
  getChainIdByNetworkName,
  getPersistedChainId,
  persistCurrentChainId,
} from './chain-state.js';
export {
  disconnectWalletConnectSessions,
  expireWalletConnectTopic,
  hasActivePairing,
  hasActiveSession,
  purgeOrphanedSessions,
  removeSessionRecord,
} from './teardown.js';
export {
  connectWalletConnectSession,
  prepareWalletConnectNamespace,
  restoreNamespaceSession,
  restoreWalletConnectSession,
} from './lifecycle.js';
export {
  findSessionByNamespace,
  getCaipNamespace,
  getSessionNamespace,
} from './lookup.js';
export {
  type ConnectNamespacePayload,
  buildConnectNamespacePayload,
  generateOptionalNamespace,
  shouldRequireNamespacesOnConnect,
} from './proposals.js';
export {
  type EvmChainDeps,
  ensureConnectedToChain,
  getCurrentChainId,
  resolveActiveChainReference,
  switchEvmNetwork,
  switchToChainIfNeeded,
} from './evm-chain.js';
export { restoreAndCacheSession } from './restore-cache.js';
