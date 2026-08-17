import type { CaipAccount } from '../common/mod.js';

import { getNamespaceFromCaip2ChainId } from '@hub3js/std/utils';
import { AccountId } from 'caip';

import { CAIP_NAMESPACE } from './constants.js';

export function isUtxoNamespace(caip2ChainId: string): boolean {
  return getNamespaceFromCaip2ChainId(caip2ChainId) === CAIP_NAMESPACE;
}

export function formatAccountsToCAIP(accounts: string[], chainId: string) {
  return accounts.map(
    (account) =>
      AccountId.format({
        address: account.toString(),
        chainId: {
          namespace: CAIP_NAMESPACE,
          reference: chainId,
        },
      }) as CaipAccount
  );
}
