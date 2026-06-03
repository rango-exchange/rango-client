import type { ProxiedNamespace } from '@hub3js/core';
import type { XRPLActions } from '@rango-dev/wallets-core/namespaces/xrpl';

export type XrplNamespace = ProxiedNamespace<XRPLActions>;
export type TargetToken = {
  currency: string;
  account: string;
  amount: string;
};
