import type { BlockchainMeta } from 'rango-types';

import {
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_NAMESPACE as CAIP_EVM_NAMESPACE,
} from '@hub3js/evm';
import {
  CAIP_SOLANA_CHAIN_ID,
  CAIP_NAMESPACE as CAIP_SOLANA_NAMESPACE,
} from '@hub3js/solana';
import {
  CAIP_STARKNET_CHAIN_ID,
  CAIP_NAMESPACE as CAIP_STARKNET_NAMESPACE,
} from '@hub3js/starknet';
import {
  CAIP_STELLAR_CHAIN_ID,
  CAIP_NAMESPACE as CAIP_STELLAR_NAMESPACE,
} from '@hub3js/stellar';
import {
  CAIP_SUI_CHAIN_ID,
  CAIP_NAMESPACE as CAIP_SUI_NAMESPACE,
} from '@hub3js/sui';
import {
  CAIP_TON_CHAIN_ID,
  CAIP_NAMESPACE as CAIP_TVM_NAMESPACE,
} from '@hub3js/tvm';
import {
  CAIP_XRPL_CHAIN_ID,
  CAIP_NAMESPACE as CAIP_XRPL_NAMESPACE,
} from '@hub3js/xrpl';
import {
  CAIP_TRON_CHAIN_ID,
  CAIP_NAMESPACE as CAIP_TRON_NAMESPACE,
} from '@rango-dev/wallets-core/namespaces/tron';
import {
  CAIP_BITCOIN_CHAIN_ID,
  CAIP_BITCOINCASH_CHAIN_ID,
  CAIP_DOGECOIN_CHAIN_ID,
  CAIP_LITECOIN_CHAIN_ID,
  CAIP_NAMESPACE as CAIP_UTXO_NAMESPACE,
  CAIP_ZCASH_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/utxo';
import { TransactionType } from 'rango-types';

import { Networks } from './networks.js';

/**
 * A CAIP-2 chain id, e.g. `eip155:1` or `bip122:000000000019d6689c085ae165831e93`.
 *
 * @see https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md
 */
export type CaipChainId = `${string}:${string}`;

/** Pair a namespace with a reference here, not at call sites — that's where ids get crossed. */
export const CAIP_CHAINS = {
  BITCOIN: `${CAIP_UTXO_NAMESPACE}:${CAIP_BITCOIN_CHAIN_ID}`,
  BITCOINCASH: `${CAIP_UTXO_NAMESPACE}:${CAIP_BITCOINCASH_CHAIN_ID}`,
  DOGECOIN: `${CAIP_UTXO_NAMESPACE}:${CAIP_DOGECOIN_CHAIN_ID}`,
  ETHEREUM: `${CAIP_EVM_NAMESPACE}:${CAIP_ETHEREUM_CHAIN_ID}`,
  LITECOIN: `${CAIP_UTXO_NAMESPACE}:${CAIP_LITECOIN_CHAIN_ID}`,
  SOLANA: `${CAIP_SOLANA_NAMESPACE}:${CAIP_SOLANA_CHAIN_ID}`,
  STARKNET: `${CAIP_STARKNET_NAMESPACE}:${CAIP_STARKNET_CHAIN_ID}`,
  STELLAR: `${CAIP_STELLAR_NAMESPACE}:${CAIP_STELLAR_CHAIN_ID}`,
  SUI: `${CAIP_SUI_NAMESPACE}:${CAIP_SUI_CHAIN_ID}`,
  TON: `${CAIP_TVM_NAMESPACE}:${CAIP_TON_CHAIN_ID}`,
  TRON: `${CAIP_TRON_NAMESPACE}:${CAIP_TRON_CHAIN_ID}`,
  XRPL: `${CAIP_XRPL_NAMESPACE}:${CAIP_XRPL_CHAIN_ID}`,
  ZCASH: `${CAIP_UTXO_NAMESPACE}:${CAIP_ZCASH_CHAIN_ID}`,
} as const satisfies Record<string, CaipChainId>;

type BlockchainMetaForCaip = Pick<BlockchainMeta, 'type' | 'chainId' | 'name'>;

const HEX_RADIX = 16;
const DECIMAL_RADIX = 10;

/**
 * `TRANSFER` covers several UTXO chains and its meta `chainId` is always `null`, so
 * these can only be keyed by name. This table is the one place in the wallet packages
 * that has to know a Rango chain name — everywhere else works in CAIP-2 ids, which is
 * why `Networks` shouldn't spread beyond it.
 *
 * DASH is knowingly absent: no CAIP constant and no provider supports it, so it
 * converts to `null` and is dropped.
 */
const CAIP_BY_TRANSFER_BLOCKCHAIN_NAME: Record<string, CaipChainId> = {
  [Networks.BCH]: CAIP_CHAINS.BITCOINCASH,
  [Networks.BTC]: CAIP_CHAINS.BITCOIN,
  [Networks.DOGE]: CAIP_CHAINS.DOGECOIN,
  [Networks.LTC]: CAIP_CHAINS.LITECOIN,
  [Networks.ZCASH]: CAIP_CHAINS.ZCASH,
};

/**
 * `eip155` references are decimal but meta reports EVM chainIds as hex ('0xa86a'), and
 * Hyperliquid reports a bare decimal ('1337') — so the prefix picks the radix, not the
 * chain family.
 */
function toNumericCaip(
  namespace: string,
  chainId: string | null | undefined
): CaipChainId | null {
  if (!chainId) {
    return null;
  }

  const isHex = /^0x[0-9a-f]+$/i.test(chainId);
  const isDecimal = /^[0-9]+$/.test(chainId);

  // `parseInt` stops at the first bad character, so '12abc' would become chain id '12'.
  if (!isHex && !isDecimal) {
    return null;
  }

  const reference = parseInt(chainId, isHex ? HEX_RADIX : DECIMAL_RADIX);

  return Number.isSafeInteger(reference) ? `${namespace}:${reference}` : null;
}

type CaipResolver =
  | CaipChainId
  | ((blockchainMeta: BlockchainMetaForCaip) => CaipChainId | null)
  | null;

/**
 * A total `Record` on purpose: a new `TransactionType` in rango-types fails to compile
 * here instead of silently making that family invisible to every wallet.
 */
const CAIP_BY_TRANSACTION_TYPE: Record<TransactionType, CaipResolver> = {
  /*
   * Fixed ids, ignoring meta `chainId` — it is NOT the CAIP reference for several of
   * these (meta reports Solana as 'mainnet-beta', Sui as 'sui-mainnet'), so deriving
   * from it would produce ids that don't match the accounts providers report.
   */
  [TransactionType.SOLANA]: CAIP_CHAINS.SOLANA,
  [TransactionType.STARKNET]: CAIP_CHAINS.STARKNET,
  [TransactionType.STELLAR]: CAIP_CHAINS.STELLAR,
  [TransactionType.SUI]: CAIP_CHAINS.SUI,
  [TransactionType.TON]: CAIP_CHAINS.TON,
  [TransactionType.TRON]: CAIP_CHAINS.TRON,
  [TransactionType.XRPL]: CAIP_CHAINS.XRPL,

  [TransactionType.EVM]: (blockchainMeta) =>
    toNumericCaip(CAIP_EVM_NAMESPACE, blockchainMeta.chainId),

  /*
   * `eip155` so the wallets claiming the whole EVM family keep supporting Hyperliquid,
   * as they did when they listed it by name. The reference is meta's 1337, NOT
   * HyperEVM's real 999 — safe only because an `eip155` reference is never turned back
   * into a chain id. Give Hyperliquid its own namespace before deriving a network
   * switch or RPC target from this.
   */
  [TransactionType.HYPERLIQUID]: (blockchainMeta) =>
    toNumericCaip(CAIP_EVM_NAMESPACE, blockchainMeta.chainId),

  [TransactionType.TRANSFER]: (blockchainMeta) =>
    CAIP_BY_TRANSFER_BLOCKCHAIN_NAME[blockchainMeta.name] ?? null,

  // Not addressable — no namespace claims it, so no provider can match it.
  [TransactionType.COSMOS]: null,
};

/**
 * Convert a meta entry to its CAIP-2 chain id, so providers are handed CAIP rather than
 * Rango names. `null` means "not addressable by CAIP" — callers should skip the chain
 * rather than fall back to a name.
 */
export function convertBlockchainMetaToCaip(
  blockchainMeta: BlockchainMetaForCaip
): CaipChainId | null {
  const resolver = CAIP_BY_TRANSACTION_TYPE[blockchainMeta.type];

  if (!resolver) {
    return null;
  }

  return typeof resolver === 'function' ? resolver(blockchainMeta) : resolver;
}

/**
 * The name-level counterpart to {@link convertBlockchainMetaToCaip}: signers get
 * `asset.blockchain` ('BTC'), not a chain id. Only `TRANSFER` names resolve.
 */
export function isTransferBlockchainName(
  blockchainName: string,
  caipChainId: CaipChainId
): boolean {
  return CAIP_BY_TRANSFER_BLOCKCHAIN_NAME[blockchainName] === caipChainId;
}

export function isBitcoinBlockchain(blockchainName: string): boolean {
  return isTransferBlockchainName(blockchainName, CAIP_CHAINS.BITCOIN);
}

export function isZcashBlockchain(blockchainName: string): boolean {
  return isTransferBlockchainName(blockchainName, CAIP_CHAINS.ZCASH);
}
