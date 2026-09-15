import type { SessionTypes, SignClientTypes } from '@walletconnect/types';

import { AccountId } from 'caip';

/**
 * `accountsChanged` entries are CAIP-10 (`eip155:1:0x…`) from wallets that follow
 * WC and a bare `0x…` from the ones forwarding the EIP-1193 payload as-is.
 */
export function extractAddress(account: string): string {
  return account.includes(':') ? new AccountId(account).address : account;
}

export function getAccountsFromSession(session: SessionTypes.Struct) {
  const accounts = Object.values(session.namespaces)
    .map((namespace) => namespace.accounts)
    .flat()
    .map((account) => {
      const { address, chainId } = new AccountId(account);
      return {
        address,
        chainId: chainId.reference,
      };
    });
  return accounts;
}

export function getAccountsFromEvent(
  event: SignClientTypes.BaseEventArgs<{
    namespaces: SessionTypes.Namespaces;
  }>
) {
  const accounts = Object.values(event.params.namespaces)
    .map((namespace) => namespace.accounts)
    .flat()
    .map((account) => {
      const { address, chainId } = new AccountId(account);
      return {
        accounts: [address],
        chainId: chainId.reference,
      };
    });

  return accounts;
}
