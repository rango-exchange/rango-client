import type { CaipAccount } from '../common/mod.js';

import { AccountId } from 'caip';

import { CAIP_NAMESPACE, CAIP_XRPL_CHAIN_ID } from './constants.js';

export function formatAddressToCAIP(address: string): string {
  return AccountId.format({
    address,
    chainId: {
      namespace: CAIP_NAMESPACE,
      reference: CAIP_XRPL_CHAIN_ID,
    },
  }) as CaipAccount;
}
