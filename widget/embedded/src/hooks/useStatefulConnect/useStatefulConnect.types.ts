import type { ExtendedModalWalletInfo } from '../../utils/wallets';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

export interface HandleConnectOptions {
  // To have a switch between connect and disconnect when user is clicking on a button, this option can be helpful.
  disconnectIfConnected?: boolean;
  defaultSelectedChains?: string[];
}

export interface NeedsNamespacesState {
  targetWallet: ExtendedModalWalletInfo;
  defaultSelectedChains?: string[];
}

export interface DetachedPayload {
  targetWallet: ExtendedModalWalletInfo;
  selectedNamespaces:
    | { namespace: Namespace; derivationPath?: string }[]
    | null;
  derivationPath?: string;
}

export interface NeedsDerivationPathState {
  providerType: string;
  providerImage: string;
  namespace: Namespace;
}

export enum ResultStatus {
  Connected = 'connected',
  Namespace = 'namespace',
  DerivationPath = 'derivation-path',
  Disconnected = 'disconnected',
  DisconnectedUnhandled = 'disconnected-unhandled',
  Noop = 'noop',
  Detached = 'Detached',
}

export type Result = { status: ResultStatus };

// State types

interface UpdateNamespaceAction {
  type: 'needsNamespace';
  payload: NeedsNamespacesState;
}

interface UpdateDerivationPathAction {
  type: 'needsDerivationPath';
  payload: NeedsDerivationPathState;
}

interface UpdateDetachedAction {
  type: 'detached';
  payload: DetachedPayload;
}

interface ResetAction {
  type: 'reset';
}

interface ResetDerivationAction {
  type: 'resetDerivation';
}

export type Actions =
  | ResetAction
  | ResetDerivationAction
  | UpdateDerivationPathAction
  | UpdateNamespaceAction
  | UpdateDetachedAction;
