import type { CaipAccount } from '../common/mod.js';

import { getNamespaceFromCaip2ChainId } from '@hub3js/std/utils';
import { AccountId } from 'caip';

import { CAIP_NAMESPACE, CAIP_TRON_CHAIN_ID } from './constants.js';

export function isTronNamespace(caip2ChainId: string): boolean {
  return getNamespaceFromCaip2ChainId(caip2ChainId) === CAIP_NAMESPACE;
}

export function formatAccountsToCAIP(accounts: string[]) {
  return accounts.map(
    (account) =>
      AccountId.format({
        address: account.toString(),
        chainId: {
          namespace: CAIP_NAMESPACE,
          reference: CAIP_TRON_CHAIN_ID,
        },
      }) as CaipAccount
  );
}
