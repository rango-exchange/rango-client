import type { Namespace } from '@hub3js/namespaces';
import type { DerivationPath } from '@rango-dev/wallets-blockchains';

import { DERIVATION_PATHS_BY_NAMESPACE } from '@rango-dev/wallets-blockchains';

export const CUSTOM_DERIVATION_PATH: DerivationPath = {
  id: 'custom',
  label: 'Custom',
  generateDerivationPath: (index: string) => index,
};

export function getDerivationPaths(
  selectedNamespace?: Namespace
): DerivationPath[] {
  const selectedNamespaceDerivationPaths = selectedNamespace
    ? DERIVATION_PATHS_BY_NAMESPACE[selectedNamespace]
    : null;

  const derivationPaths: DerivationPath[] = !!selectedNamespaceDerivationPaths
    ? [...selectedNamespaceDerivationPaths, CUSTOM_DERIVATION_PATH]
    : [];

  return derivationPaths;
}
