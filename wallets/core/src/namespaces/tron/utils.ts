import type {
  ProviderAPI,
  TronBuiltTransaction,
  TronRawDataContract,
  TronTransactionPayload,
  TronWebApi,
} from './types.js';
import type { CaipAccount } from '../common/mod.js';

import { getNamespaceFromCaip2ChainId } from '@hub3js/std/utils';
import { AccountId } from 'caip';

import {
  APPROVE_FUNCTION_SELECTOR,
  CAIP_NAMESPACE,
  CAIP_TRON_CHAIN_ID,
  FUNCTION_SELECTOR_HEX_LENGTH,
} from './constants.js';

export function isTronNamespace(caip2ChainId: string): boolean {
  return getNamespaceFromCaip2ChainId(caip2ChainId) === CAIP_NAMESPACE;
}

/**
 * Describes a built approve call the way a server-built transaction does.
 *
 * Wallets that let the user choose the allowance rebuild the transaction from
 * `__payload__` instead of decoding `raw_data`. TronWeb's `transactionBuilder`
 * leaves it out, and given an empty one TronLink cannot re-issue the call and
 * reports "Modification failed", so the approve can never be signed there.
 *
 * The values are read back out of the built transaction rather than recomputed,
 * so they cannot drift from what was actually built and signed.
 */
export function buildApprovePayload(
  transaction: TronBuiltTransaction,
  feeLimit: number
): TronTransactionPayload | undefined {
  const rawData = transaction.raw_data as
    | { contract?: TronRawDataContract[] }
    | undefined;
  const call = rawData?.contract?.[0]?.parameter?.value;

  if (!call?.data || !call.owner_address || !call.contract_address) {
    return undefined;
  }

  return {
    type: 'WEB',
    owner_address: call.owner_address,
    call_value: 0,
    contract_address: call.contract_address,
    fee_limit: feeLimit,
    function_selector: APPROVE_FUNCTION_SELECTOR,
    parameter: call.data.slice(FUNCTION_SELECTOR_HEX_LENGTH),
    chainType: null,
  };
}

/** The wallet-injected TronWeb instance, or a readable error when absent. */
export function getTronWeb(
  instance: () => ProviderAPI | undefined
): TronWebApi {
  const tronInstance = instance();
  if (!tronInstance?.tronWeb) {
    throw new Error('Tron is not available on your wallet.');
  }
  return tronInstance.tronWeb;
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
