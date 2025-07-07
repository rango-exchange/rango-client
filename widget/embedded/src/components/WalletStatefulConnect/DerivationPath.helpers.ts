import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { DerivationPath } from '@rango-dev/wallets-shared';

import { namespaces } from '@rango-dev/wallets-shared';

export const CUSTOM_DERIVATION_PATH: DerivationPath = {
  id: 'custom',
  label: 'Custom',
  generateDerivationPath: (index: string) => index,
};

export function getDerivationPaths(
  selectedNamespace?: Namespace
): DerivationPath[] {
  const selectedNamespaceDerivationPaths = selectedNamespace
    ? namespaces[selectedNamespace]?.derivationPaths
    : null;

  const derivationPaths: DerivationPath[] = !!selectedNamespaceDerivationPaths
    ? [...selectedNamespaceDerivationPaths, CUSTOM_DERIVATION_PATH]
    : [];

  return derivationPaths;
}
