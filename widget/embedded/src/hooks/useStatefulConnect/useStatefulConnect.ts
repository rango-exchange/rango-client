import type { HandleConnectOptions, Result } from './useStatefulConnect.types';
import type { WalletInfoWithExtra } from '../../types';
import type { Namespace } from '@arlert-dev/wallets-core/namespaces/common';
import type { NamespaceData, WalletType } from '@arlert-dev/wallets-shared';

import { WalletState } from '@arlert-dev/ui';
import { useWallets } from '@arlert-dev/wallets-react';
import { useReducer } from 'react';

import { isOnDetached } from '../../components/StatefulConnectModal';
import { type ExtendedModalWalletInfo } from '../../utils/wallets';

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
  handleDisconnect: (wallet: WalletInfoWithExtra) => Promise<Result>;
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
      /*
       * Currently, handling connect should be covered for 3 different types of target wallet:
       * 1. Target wallet does not contain any namespaces, in this situation we should just try to connect to the related provider.
       * 2. Target wallet contains more than one namespace, in this situation we should display namespaces modal to allow the user to choose from available namespaces.
       * 3. Target wallet contains only one namespace, in this situation we should check if that namespace needs derivation path and based on that, try to connect to the related provider or display derivation path modal.
       */

      // Legacy and hub have different structure to handle each situation.
      const isHub = !!wallet.isHub;
      const needsNamespace = isHub
        ? wallet.properties?.find((item) => item.name === 'namespaces')?.value
        : wallet.needsNamespace;

      const needsDerivationPath = isHub
        ? wallet.properties?.find((item) => item.name === 'derivationPath')
            ?.value
        : wallet.needsDerivationPath;

      // 1. Target wallet does not contain any namespaces
      if (!needsNamespace?.data?.length) {
        return await runConnect(wallet.type, undefined, options);
      }

      // 2. Target wallet contains more than one namespace
      if (needsNamespace?.data.length && needsNamespace.data.length > 1) {
        dispatch({
          type: 'needsNamespace',
          payload: {
            targetWallet: wallet,
            defaultSelectedChains: options?.defaultSelectedChains,
          },
        });
        return { status: ResultStatus.Namespace };
      }

      // 3. Target wallet contains only one namespace
      if (needsNamespace?.data.length === 1) {
        if (needsDerivationPath) {
          const namespace = needsNamespace.data[0];

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
          needsNamespace?.data?.map((namespace) => ({
            namespace: namespace.value,
          })),
          options
        );
      }
    }

    // If the wallet is a hub wallet and it is connected (fully or partially) and it contains more than one namespace, we should display detached modal
    if (!!wallet.isHub) {
      const needsNamespace = wallet.properties?.find(
        (item) => item.name === 'namespaces'
      )?.value;
      if (needsNamespace?.data.length && needsNamespace.data.length > 1) {
        dispatch({
          type: 'detached',
          payload: {
            targetWallet: wallet,
            selectedNamespaces: null,
          },
        });
        return { status: ResultStatus.Detached };
      }
    }

    if (options?.disconnectIfConnected) {
      await handleDisconnect(wallet);
      return { status: ResultStatus.Disconnected };
    }

    return { status: ResultStatus.DisconnectedUnhandled };
  };

  const handleNamespace = async (
    wallet: ExtendedModalWalletInfo,
    selectedNamespaces: Namespace[]
  ): Promise<Result> => {
    const isHub = !!wallet.isHub;
    const needsNamespace = isHub
      ? wallet.properties?.find((item) => item.name === 'namespaces')?.value
      : wallet.needsNamespace;

    const needsDerivationPath = isHub
      ? wallet.properties?.find((item) => item.name === 'derivationPath')?.value
      : wallet.needsDerivationPath;

    const isSingleNamespace = needsNamespace?.selection === 'single';
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

    const namespaces = selectedNamespaces.map((namespace) => ({
      namespace,
    }));

    dispatch({
      type: 'detached',
      payload: {
        targetWallet: wallet,
        selectedNamespaces:
          namespaces?.map((namespace) => namespace.namespace) || null,
      },
    });
    return { status: ResultStatus.Detached };
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

  const getState = () => connectState;

  const handleDisconnect = async (
    wallet: ExtendedModalWalletInfo
  ): Promise<Result> => {
    const walletState = state(wallet.type);
    if (walletState.connected || walletState.connecting) {
      await disconnect(wallet.type);

      if (isOnDetached(getState)) {
        dispatch({
          type: 'needsNamespace',
          payload: {
            targetWallet: wallet,
          },
        });
        return { status: ResultStatus.Namespace };
      }

      return { status: ResultStatus.Disconnected };
    }

    return { status: ResultStatus.Noop };
  };

  return {
    handleConnect,
    handleDisconnect,
    handleNamespace,
    handleDerivationPath,
    getState,
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
