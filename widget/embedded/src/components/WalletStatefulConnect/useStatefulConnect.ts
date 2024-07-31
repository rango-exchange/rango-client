import type { WalletInfoWithExtra } from '../../types';
import type {
  Namespace,
  NamespaceData,
  WalletType,
} from '@rango-dev/wallets-shared';

import { WalletState } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import { useReducer } from 'react';

interface API {
  handleConnect: (
    wallet: WalletInfoWithExtra,
    options?: HandleConnectOptions
  ) => Promise<void>;
  handleNamespace: (
    wallet: WalletInfoWithExtra,
    selectedNamespaces: Namespace[]
  ) => Promise<void>;
  handleDerivationPath: (path: string) => Promise<void>;
  handleDisconnect: (type: WalletType) => Promise<void>;
  getState(): State;
  resetState(section?: 'derivation'): void;
}

interface HandleConnectOptions {
  onBeforeConnect?: (walletType: string) => void;
  onConnect?: (walletType: string) => void;
}

interface NeedsNamespacesState {
  providerType: string;
  providerImage: string;
  availableNamespaces?: Namespace[];
  singleNamespace?: boolean;
}

interface NeedsDerivationPathState {
  providerType: string;
  providerImage: string;
  namespace: Namespace;
}

interface State {
  status: 'init' | 'namespace' | 'derivationPath';
  namespace: NeedsNamespacesState | null;
  derivationPath: NeedsDerivationPathState | null;
}

interface UpdateNamespaceAction {
  type: 'needsNamespace';
  payload: NeedsNamespacesState;
}

interface UpdateDerivationPathAction {
  type: 'needsDerivationPath';
  payload: NeedsDerivationPathState;
}

interface ResetAction {
  type: 'reset';
}

interface ResetDerivationAction {
  type: 'resetDerivation';
}

type Actions =
  | ResetAction
  | ResetDerivationAction
  | UpdateDerivationPathAction
  | UpdateNamespaceAction;

const initState: State = {
  status: 'init',
  namespace: null,
  derivationPath: null,
};

function reducer(state: State, action: Actions): State {
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
    case 'reset':
      return initState;
    case 'resetDerivation':
      return {
        ...state,
        derivationPath: null,
        status: 'namespace',
      };
    default:
      throw new Error(`Action hasn't been defined.`);
  }
}

/**
 *
 * This hook maintain an state and detects if the wallet needs what information
 * to correctly call the `core`'s `connect` method with required information.
 *
 * The final goal is running `runConnect` which calls `wallets/core`'s `connect` method.
 * But sometimes it needs to get more information like what namespace it should be connected to,
 * or what derivation path should be used for.
 *
 */
export function useStatefulConnect(): API {
  const { state, disconnect, connect } = useWallets();

  const [connectState, dispatch] = useReducer(reducer, initState);

  const runConnect = async (
    type: WalletType,
    namespaces?: NamespaceData[],
    options?: HandleConnectOptions
  ) => {
    /*
     * When running this function, it means all optional steps (like namespace and derivation path) has passed, or wallet doesn't need them at all.
     * By resetting state, we will make sure when user tries to connect other wallets, it doesn't have unexpected states.
     */
    dispatch({
      type: 'reset',
    });

    const wallet = state(type);
    try {
      if (wallet.connected) {
        await disconnect(type);
      } else {
        options?.onBeforeConnect?.(type);
        await connect(type, undefined, namespaces);
        options?.onConnect?.(type);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const message = e?.message
        ? `Error: ${e.message}`
        : 'An unknown error happened during connecting wallet.';

      throw new Error(message, { cause: e });
    }
  };

  const handleConnect = async (
    wallet: WalletInfoWithExtra,
    options?: HandleConnectOptions
  ) => {
    const isDisconnected = wallet.state === WalletState.DISCONNECTED;

    if (isDisconnected && !!wallet.namespaces?.length) {
      const needsNamespace = wallet.namespaces.length > 1;
      const needsDerivationPath = wallet.needsDerivationPath;

      if (needsNamespace) {
        dispatch({
          type: 'needsNamespace',
          payload: {
            providerType: wallet.type,
            providerImage: wallet.image,
            availableNamespaces: wallet.namespaces,
            singleNamespace: wallet.singleNamespace,
          },
        });
        return;
      } else if (needsDerivationPath) {
        dispatch({
          type: 'needsDerivationPath',
          payload: {
            providerType: wallet.type,
            providerImage: wallet.image,
            namespace: wallet.namespaces[0],
          },
        });
      } else {
        // TODO: Not sure why undefined
        return runConnect(wallet.type, undefined, options);
      }
    }
  };

  const handleNamespace = async (
    wallet: WalletInfoWithExtra,
    selectedNamespaces: Namespace[]
  ) => {
    const isSingleNamespace = wallet.singleNamespace;
    const needsDerivationPath = wallet.needsDerivationPath;
    const firstSelectedNamespace = selectedNamespaces[0];

    if (!firstSelectedNamespace) {
      throw new Error(
        'To confirm a namespace, you should select at least one namespace.'
      );
    }

    /*
     * Currently we support derivation path only for single namespace wallets.
     *
     * Basically Single namespace is a list with radio buttons to let the user select one value within the list.
     */
    if (isSingleNamespace && needsDerivationPath) {
      dispatch({
        type: 'needsDerivationPath',
        payload: {
          providerType: wallet.type,
          providerImage: wallet.image,
          namespace: firstSelectedNamespace,
        },
      });
    } else {
      /**
       * If execution reaches here, means we don't have any more optional step (like namespace and derivation)
       * So we should start connecting wallet.
       */
      const type = connectState.namespace!.providerType;
      const namespaces = selectedNamespaces.map((namespace) => ({
        namespace,
      }));

      return runConnect(type, namespaces);
    }
  };

  const handleDerivationPath = async (derivationPath: string) => {
    if (!derivationPath) {
      throw new Error(
        "Derivation path is empty. Please make sure you've filled the field correctly."
      );
    }

    const isStateOnDerivationPathStep = !!connectState.derivationPath;

    if (!isStateOnDerivationPathStep) {
      throw new Error(
        'It seems you are filling derivation path without setting namespace before doing that. Please retry to connect.'
      );
    }
    const type = connectState.derivationPath!.providerType;
    const selectedNamespace = connectState.derivationPath!.namespace;
    const namespaces = [{ namespace: selectedNamespace, derivationPath }];

    return runConnect(type, namespaces);
  };

  const handleDisconnect = async (type: WalletType) => {
    const wallet = state(type);
    if (wallet.connected) {
      await disconnect(type);
    }
  };

  return {
    handleConnect,
    handleDisconnect,
    handleNamespace,
    handleDerivationPath,
    getState: () => connectState,
    resetState: (section?: 'derivation') => {
      if (section === 'derivation') {
        dispatch({
          type: 'resetDerivation',
        });
      } else {
        dispatch({
          type: 'reset',
        });
      }
    },
  };
}
