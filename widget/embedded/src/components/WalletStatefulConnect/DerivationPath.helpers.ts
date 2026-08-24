import type { ProviderProperty } from '@hub3js/core/store';
import type { Namespace } from '@hub3js/namespaces';

export type DerivationPathTemplate = Extract<
  ProviderProperty,
  { name: 'derivationPath' }
>['value']['data'][number];

export type DerivationPathOption = Omit<DerivationPathTemplate, 'namespace'>;

export const CUSTOM_DERIVATION_PATH: DerivationPathOption = {
  id: 'custom',
  label: 'Custom',
  generateDerivationPath: (index: string) => index,
};

export function getDerivationPaths(
  derivationPaths: DerivationPathTemplate[],
  selectedNamespace?: Namespace
): DerivationPathOption[] {
  const selectedNamespaceDerivationPaths = derivationPaths.filter(
    (derivationPath) => derivationPath.namespace === selectedNamespace
  );

  return selectedNamespaceDerivationPaths.length
    ? [...selectedNamespaceDerivationPaths, CUSTOM_DERIVATION_PATH]
    : [];
}
