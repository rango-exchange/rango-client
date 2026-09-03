import type { Accounts } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface TronActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
  /** Reads the current TRC-20 allowance, returned as a decimal string. */
  getAllowance: (params: TronAllowanceParams) => Promise<string>;
  /** Builds (via the node) a ready-to-sign TRC-20 `approve` transaction. */
  buildApproveTransaction: (
    params: TronApproveParams
  ) => Promise<TronBuiltTransaction>;
  /** Reads a transaction's on-chain info (fields are empty while unconfirmed). */
  getTransactionInfo: (txID: string) => Promise<TronTransactionInfo>;
}

/** Addresses are provided in 0x-hex form and converted to Tron form internally. */
export type TronAllowanceParams = {
  token: string;
  owner: string;
  spender: string;
};

export type TronApproveParams = {
  token: string;
  owner: string;
  spender: string;
  /** Amount to approve, as an integer string in the token's smallest unit. */
  amount: string;
  /** Fee limit in SUN; defaults to DEFAULT_APPROVE_FEE_LIMIT when omitted. */
  feeLimit?: number;
};

/**
 * The focused TronWeb surface the repo calls — both these namespace actions and
 * the Tron signer, which is handed this same injected instance. `tronweb` is not
 * a repo dependency (wallets use the wallet-injected instance), so we type only
 * the methods we use rather than pulling the package's declarations.
 *
 * @see https://tronweb.network/docu/docs/intro TronWeb API reference — used
 * here: `transactionBuilder.triggerConstantContract` / `triggerSmartContract`,
 * `trx.getUnconfirmedTransactionInfo` / `sign` / `signMessageV2` /
 * `sendRawTransaction`, and `address.fromHex`.
 */
export interface TronWebApi {
  defaultAddress: { base58: string };
  transactionBuilder: {
    triggerConstantContract: (
      contractAddress: string,
      functionSelector: string,
      options: TriggerOptions,
      parameters: TriggerParameter[],
      issuerAddress: string
    ) => Promise<TriggerConstantContractResult>;
    triggerSmartContract: (
      contractAddress: string,
      functionSelector: string,
      options: TriggerOptions,
      parameters: TriggerParameter[],
      issuerAddress: string
    ) => Promise<TriggerSmartContractResult>;
  };
  trx: {
    /**
     * Full-node lookup that returns the info as soon as the tx is in a block
     * (~3s). `getTransactionInfo` queries the solidity node instead and returns
     * an empty object until the tx solidifies (~60s), so it is unsuitable for
     * promptly resolving approve-transaction status.
     */
    getUnconfirmedTransactionInfo: (
      txID: string
    ) => Promise<TronTransactionInfo>;
    signMessageV2: (message: string) => Promise<string>;
    sign: (transaction: object) => Promise<TronSignedTransaction>;
    sendRawTransaction: (
      signedTransaction: TronSignedTransaction
    ) => Promise<TronBroadcastReceipt>;
  };
  address: {
    fromHex: (hexAddress: string) => string;
  };
}

/** A contract-call parameter, e.g. `{ type: 'address', value: 'T...' }`. */
export type TriggerParameter = { type: string; value: string };
export type TriggerOptions = { feeLimit?: number };

/**
 * A transaction as returned by TronWeb's `transactionBuilder` — the subset of
 * fields the Tron signer consumes to sign and broadcast.
 */
export interface TronBuiltTransaction {
  txID: string;
  raw_data: unknown;
  raw_data_hex: string;
  visible?: boolean;
}

/** A transaction after signing, carrying the id it was signed under. */
export interface TronSignedTransaction {
  txID?: string;
}

/**
 * The response to a broadcast. Wallet-injected TronWeb instances disagree on
 * where the transaction id lives, so both known shapes are optional here.
 */
export interface TronBroadcastReceipt {
  txid?: string;
  transaction?: { txID?: string };
}

export interface TriggerConstantContractResult {
  result: { result: boolean };
  /** ABI-encoded return words; `constant_result[0]` holds the allowance. */
  constant_result: string[];
  transaction: TronBuiltTransaction;
}

export interface TriggerSmartContractResult {
  result: { result: boolean };
  transaction: TronBuiltTransaction;
}

/** The receipt embedded in a Tron transaction's on-chain info. */
export interface TronTransactionReceipt {
  /** e.g. 'SUCCESS' | 'REVERT' | 'OUT_OF_ENERGY'; absent while unconfirmed. */
  result?: string;
}

export interface TronTransactionInfo {
  id?: string;
  blockNumber?: number;
  receipt?: TronTransactionReceipt;
}

/** The injected Tron provider instance, which exposes a TronWeb instance. */
export interface ProviderAPI {
  // Providers attach extra members (request, ready, …) we don't type here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  tronWeb: TronWebApi;
}
