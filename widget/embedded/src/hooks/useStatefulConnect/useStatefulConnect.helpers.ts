import type { State } from './useStatefulConnect.state';

export function isStateOnDerivationPathStep(
  state: State
): state is State & { derivationPath: NonNullable<State['derivationPath']> } {
  return !!state.derivationPath;
}

export function isStateOnNamespace(
  state: State
): state is State & { namespace: NonNullable<State['namespace']> } {
  return !!state.namespace;
}
