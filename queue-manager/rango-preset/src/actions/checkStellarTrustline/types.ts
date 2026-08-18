import type { ProxiedNamespace } from '@hub3js/core';
import type { StellarActions } from '@hub3js/stellar';

export type StellarNamespace = ProxiedNamespace<StellarActions>;
export type TargetToken = {
  code: string;
  issuer: string;
  value: string;
};
