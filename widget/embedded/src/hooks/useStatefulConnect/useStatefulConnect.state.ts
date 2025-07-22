import type {
  Actions,
  NeedsDerivationPathState,
  NeedsNamespacesState,
} from './useStatefulConnect.types';
import type { Namespace } from '@arlert-dev/wallets-core/namespaces/common';

export interface State {
  status: 'init' | 'namespace' | 'derivationPath' | 'detached';
  namespace: NeedsNamespacesState | null;
  derivationPath: NeedsDerivationPathState | null;
  selectedNamespaces: Namespace[] | null;
}

export const initState: State = {
  status: 'init',
  namespace: null,
  derivationPath: null,
  selectedNamespaces: null,
};

export function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'needsNamespace':
      return {
        ...state,
        status: 'namespace',
        namespace: action.payload,
        derivationPath: null,
      };
    case 'needsDerivationPath':
      return {
        ...state,
        status: 'derivationPath',
        derivationPath: action.payload,
      };
    case 'detached':
      return {
        ...state,
        status: 'detached',
        namespace: { targetWallet: action.payload.targetWallet },
        selectedNamespaces: action.payload.selectedNamespaces,
      };
    case 'reset':
      return initState;
    case 'resetDerivation':
      if (state.namespace) {
        return {
          ...state,
          derivationPath: null,
          status: 'namespace',
        };
      }
      return initState;
    default:
      throw new Error(`Action hasn't been defined.`);
  }
}
