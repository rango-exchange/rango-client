import type { ProxiedNamespace } from '@hub3js/core';
import type { XRPLActions } from '@hub3js/xrpl';

export type XrplNamespace = ProxiedNamespace<XRPLActions>;
export type TargetToken = {
  currency: string;
  account: string;
  amount: string;
};
