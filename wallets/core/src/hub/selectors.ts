/**
 * Note: zustand has some difficulty when you are trying to `previous` state on `subscribe`.
 * If these selectors define inside store directly and use `get()` for accessing state, it will get the latest state
 * instead of previous state which desired.
 * So make them a helper will let us to reuse them both in store and outside of store in a `subscribe`.
 */
import type { State } from './mod.js';
import type { State as InternalProviderState } from './provider.js';

export function guessProviderStateSelector(
  state: State,
  providerId: string
): InternalProviderState {
  const allNamespaces = state.namespaces.list;
  const currentProviderNamespaces = Object.keys(allNamespaces).filter(
    (key) => allNamespaces[key].info.providerId === providerId
  );

  // TODO: I'm not sure what strategy is good for `connected` and `connecting` is better. reconsider it in future.
  const installed = state.providers.list[providerId].data.installed;
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
