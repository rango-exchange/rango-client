/**
 * Note: Zustand has some difficulty when you are trying to `previous` state on `subscribe`.
 * If these selectors define inside store directly and use `get()` for accessing state, it will get the latest state
 * instead of previous state which desired.
 * So make them a helper will let us to reuse them both in store and outside of store in a `subscribe`.
 */
import type { State } from '../mod.js';
import type { State as InternalProviderState } from '../provider/mod.js';

/**
 * Legacy provider state includes `connecting` and `connected` values. It hadn't a separation layer for `namespaces`.
 * For compatibility reasons, we should produce these two values somehow.
 *
 * Currently, We return `true` if any of namespaces return true. We are missing failed namespace here.
 * But if we want to solve that, we should migrate our client code to use `namespace` state directly and not from `provider`
 */
export function guessProviderStateSelector(
  state: State,
  providerId: string
): InternalProviderState {
  /*
   * We keep namespaces in a separate branch than providers.
   * We should look at all of them and find all the namespaces that for our current proivder.
   */
  const allNamespaces = state.namespaces.list;
  const currentProviderNamespaces = Object.keys(allNamespaces).filter(
    (key) => allNamespaces[key].info.providerId === providerId
  );

  // Returning provider state value directly.
  const installed = !!state.providers.list[providerId]?.data.installed;

  /*
   * If any namespaces returns `true`, we consider the whole provider for this field to be `true`.
   * it has a downside regarding errors which explained on top of the function.
   */
  const connected =
    currentProviderNamespaces.length > 0
      ? currentProviderNamespaces.some(
          (key) => allNamespaces[key].data.connected
        )
      : false;
  const connecting =
    currentProviderNamespaces.length > 0
      ? currentProviderNamespaces.some(
          (key) => allNamespaces[key].data.connecting
        )
      : false;

  return {
    installed,
    connected,
    connecting,
  };
}

export function namespaceStateSelector(state: State, storeId: string) {
  return state.namespaces.list[storeId].data;
}
