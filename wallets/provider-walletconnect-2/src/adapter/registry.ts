import type { WalletConnectAdapter } from './adapter.js';

/**
 * Holds the singleton adapter instance created in the provider's `init`.
 *
 * This lives in its own leaf module (importing nothing from `provider.ts` or the
 * namespaces) to break the `provider -> namespace -> provider` import cycle that
 * otherwise throws a TDZ error ("Cannot access 'getAdapter' before initialization")
 * when the namespace module evaluates its top-level subscriber factories.
 */
let adapter: WalletConnectAdapter;

export const getAdapter = () => adapter;

export const setAdapter = (instance: WalletConnectAdapter) => {
  adapter = instance;
};
