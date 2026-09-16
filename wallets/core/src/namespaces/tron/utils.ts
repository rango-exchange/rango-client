import type { TronWebApi } from './types.js';
import type { CaipAccount } from '../common/mod.js';

import { getNamespaceFromCaip2ChainId } from '@hub3js/std/utils';
import { AccountId } from 'caip';

import { CAIP_NAMESPACE, CAIP_TRON_CHAIN_ID } from './constants.js';

export function isTronNamespace(caip2ChainId: string): boolean {
  return getNamespaceFromCaip2ChainId(caip2ChainId) === CAIP_NAMESPACE;
}

/** Tron mainnet address prefix byte (0x41) in hex. */
const TRON_HEX_ADDRESS_PREFIX = '41';

/**
 * Prerequisite addresses arrive in 0x-hex (EVM-style) form; TronWeb expects a
 * Tron address. Convert `0x<20-bytes>` → `41<20-bytes>` → Base58.
 */
export function hexAddressToTronBase58(
  tronWeb: TronWebApi,
  address: string
): string {
  const tronHex = TRON_HEX_ADDRESS_PREFIX + address.replace(/^0x/, '');
  return tronWeb.address.fromHex(tronHex);
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
