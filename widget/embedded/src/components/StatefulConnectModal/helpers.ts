import type { State } from '../../hooks/useStatefulConnect';
import type { WalletInfoWithExtra } from '../../types';

export function isOnStatus(
  getState: () => State,
  wallet?: WalletInfoWithExtra
): wallet is WalletInfoWithExtra {
  return getState().status === 'init' && !!wallet;
}

export function isOnNamespace(
  getState: () => State
): getState is () => State & { namespace: NonNullable<State['namespace']> } {
  return getState().status === 'namespace';
}

export function isOnDerivationPath(
  getState: () => State
): getState is () => State & {
  derivationPath: NonNullable<State['derivationPath']>;
} {
  return getState().status === 'derivationPath';
}

export function isOnDetached(
  getState: () => State
): getState is () => State & { namespace: NonNullable<State['namespace']> } {
  return getState().status === 'detached';
}
