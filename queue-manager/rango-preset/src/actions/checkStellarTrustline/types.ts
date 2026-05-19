import type { ProxiedNamespace } from '@rango-dev/wallets-core';
import type { StellarActions } from '@rango-dev/wallets-core/namespaces/stellar';

export type StellarNamespace = ProxiedNamespace<StellarActions>;
export type TargetToken = {
  code: string;
  issuer: string;
  value: string;
};
