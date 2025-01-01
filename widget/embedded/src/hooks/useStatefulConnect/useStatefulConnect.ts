import type { HandleConnectOptions, Result } from './useStatefulConnect.types';
import type { WalletInfoWithExtra } from '../../types';
import type { ExtendedModalWalletInfo } from '../../utils/wallets';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { NamespaceData, WalletType } from '@rango-dev/wallets-shared';

import { WalletState } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import { useReducer } from 'react';

import {
  isStateOnDerivationPathStep,
  isStateOnNamespace,
} from './useStatefulConnect.helpers';
import { initState, reducer, type State } from './useStatefulConnect.state';
import { ResultStatus } from './useStatefulConnect.types';

interface UseStatefulConnect {
  handleConnect: (
    wallet: WalletInfoWithExtra,
    options?: HandleConnectOptions
  ) => Promise<Result>;
  handleNamespace: (
    wallet: WalletInfoWithExtra,
    selectedNamespaces: Namespace[]
  ) => Promise<Result>;
  handleDerivationPath: (path: string) => Promise<Result>;
  handleDisconnect: (type: WalletType) => Promise<Result>;
  getState(): State;
  resetState(section?: 'derivation'): void;
}

/**
 *
 * This hook maintains state of wallet and checks if additional information
 * is required to call the `connect` method of `core` package properly.
 *
 * The final goal is running `runConnect` which calls `wallets/core`'s `connect` method.
 * But sometimes it needs to get more information like what namespace it should be connected to,
 * or what derivation path should be used for.
 *
 */
export function useStatefulConnect(): UseStatefulConnect {
  const { state, disconnect, connect } = useWallets();

  const [connectState, dispatch] = useReducer(reducer, initState);

  const runConnect = async (
    type: WalletType,
    namespaces?: NamespaceData[],
    _options?: HandleConnectOptions
  ): Promise<{ status: ResultStatus }> => {
    /*
     * When running this function, it means all optional steps (like namespace and derivation path) has passed, or wallet doesn't need them at all.
     * By resetting state, we will make sure when user tries to connect other wallets, it doesn't have unexpected states.
     */
    dispatch({
      type: 'reset',
    });

    try {
      const legacyNamespacesInput = namespaces?.map((namespaceInput) => ({
        ...namespaceInput,
        network: undefined,
      }));
      await connect(type, legacyNamespacesInput);

      return { status: ResultStatus.Connected };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const message = e?.message
        ? `Error: ${e.message}`
        : 'An unknown error happened during connecting wallet.';

      throw new Error(message, { cause: e });
    }
  };

  const handleConnect = async (
    wallet: ExtendedModalWalletInfo,
    options?: HandleConnectOptions
  ): Promise<{
    status: ResultStatus;
  }> => {
    const isDisconnected = wallet.state === WalletState.DISCONNECTED;

    if (isDisconnected) {
      // Legacy and hub have different structure to check wether we need to show namespace or not.

      // Hub
      const isHub = !!wallet.isHub;
      if (isHub) {
        const detachedInstances = wallet.properties?.find(
          (item) => item.name === 'detached'
        );
        const needsNamespace =
          detachedInstances && wallet.state !== 'connected';

        if (needsNamespace) {
          dispatch({
            type: 'needsNamespace',
            payload: {
              targetWallet: wallet,
            },
          });
          return { status: ResultStatus.Namespace };
        }
      }

      /*
       * Legacy
       *
       * For legacy there are 3 states:
       * 1. a wallet doesn't have any namespace defined, we call the connect.
       * 2. a wallet has more than two namespaces, we should show namepsace modal, and in that place user will be checked to needs derivation path or not.
       * 3. a wallet has exactly one namespacesape, in this case we check if that needs derivation or not, if it needs we will do it here by dispatching the action accordingly.
       */
      if (!wallet.needsNamespace) {
        return await runConnect(wallet.type, undefined, options);
      }

      const needsNamespace = wallet.needsNamespace.data.length > 1;
      const needsDerivationPath = wallet.needsDerivationPath;

      if (needsNamespace) {
        dispatch({
          type: 'needsNamespace',
          payload: {
            targetWallet: wallet,
          },
        });
        return { status: ResultStatus.Namespace };
      } else if (needsDerivationPath) {
        const namespace = wallet.needsNamespace.data[0];

        dispatch({
          type: 'needsDerivationPath',
          payload: {
            providerType: wallet.type,
            providerImage: wallet.image,
            namespace: namespace.value,
          },
        });
        return { status: ResultStatus.DerivationPath };
      }

      return await runConnect(
        wallet.type,
        wallet.needsNamespace?.data.map((namespace) => ({
          namespace: namespace.value,
        })),
        options
      );
    }

    if (options?.disconnectIfConnected) {
      await handleDisconnect(wallet.type);
      return { status: ResultStatus.Disconnected };
    }

    return { status: ResultStatus.DisconnectedUnhandled };
  };

  const handleNamespace = async (
    wallet: WalletInfoWithExtra,
    selectedNamespaces: Namespace[]
  ): Promise<Result> => {
    const isSingleNamespace = wallet.needsNamespace?.selection === 'single';
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

      return { status: ResultStatus.DerivationPath };
    }

    /**
     * If execution reaches here, means we don't have any more optional step (like namespace and derivation)
     * So we should start connecting wallet.
     */

    if (!isStateOnNamespace(connectState)) {
      // Unreachable code.
      throw new Error(
        'Something went wrong on handling namespace. Please retry.'
      );
    }

    const type = connectState.namespace.targetWallet.type;
    const namespaces = selectedNamespaces.map((namespace) => ({
      namespace,
    }));

    return await runConnect(type, namespaces);
  };

  const handleDerivationPath = async (
    derivationPath: string
  ): Promise<Result> => {
    if (!derivationPath) {
      throw new Error(
        "Derivation path is empty. Please make sure you've filled the field correctly."
      );
    }

    if (!isStateOnDerivationPathStep(connectState)) {
      throw new Error(
        'It seems you are filling derivation path without setting namespace before doing that. Please retry to connect.'
      );
    }
    const type = connectState.derivationPath.providerType;
    const selectedNamespace = connectState.derivationPath.namespace;
    const namespaces = [{ namespace: selectedNamespace, derivationPath }];

    return await runConnect(type, namespaces);
  };

  const handleDisconnect = async (type: WalletType): Promise<Result> => {
    const wallet = state(type);
    if (wallet.connected || wallet.connecting) {
      await disconnect(type);
      return { status: ResultStatus.Disconnected };
    }

    return { status: ResultStatus.Noop };
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
