import type { TypedData } from '@rango-dev/signer-evm';
import type { GenericSigner } from 'rango-types';
import type { EvmTransaction } from 'rango-types/mainApi';

import { cleanEvmError, DefaultEvmSigner } from '@rango-dev/signer-evm';

import { getProvider } from '../ledgerProvider.js';

const HEXADECIMAL_BASE = 16;

/*
 * Ledger's eth_sendTransaction params (see EthSendTransactionParams):
 *  - use `gas`, not ethers' `gasLimit`. TransactionHelper only reads
 *    `transaction.gas` → ethers gasLimit; a `gasLimit` key is ignored.
 *  - quantities should be hex. Ledger parses nonce with parseInt(nonce, 16),
 *    so a decimal nonce would be wrong. Hex also keeps fees in JSON-RPC form.
 *
 * If gas + maxFeePerGas + maxPriorityFeePerGas are not all set, Ledger
 * re-estimates and overwrites those three fields (EIP-1559). So for swaps we
 * must pass the full triad when Rango provides EIP-1559 fees; otherwise Rango's
 * gas limit is dropped.
 * https://developers.ledger.com/docs/ledger-wallet-provider/api-reference
 */
type LedgerTransactionParams = {
  data: string;
  from?: string;
  to?: string;
  value?: string;
  nonce?: string;
  gas?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
};

/** Hex-encode a Rango quantity (`0x…` or decimal string). BigInt accepts both. */
const toHexQuantity = (value: string): string =>
  '0x' + BigInt(value).toString(HEXADECIMAL_BASE);

/*
 * Map Rango's EvmTransaction to Ledger's JSON-RPC shape: gasLimit → gas,
 * quantities hex-encoded, EIP-1559 preferred over legacy gasPrice.
 */
const buildLedgerTx = (tx: EvmTransaction): LedgerTransactionParams => {
  /*
   * Always send data and value:
   *  - data: `0x` instead of undefined (same as DefaultEvmSigner.buildTx).
   *  - value: Ledger's internal Transaction type requires value; omit it on
   *    zero-value txs (approvals) and fee estimation / serialization can
   *    break. Default to 0x0.
   */
  const params: LedgerTransactionParams = {
    data: tx.data || '0x',
    value: tx.value ? toHexQuantity(tx.value) : '0x0',
  };
  if (tx.from) {
    params.from = tx.from;
  }
  if (tx.to) {
    params.to = tx.to;
  }
  if (tx.nonce) {
    params.nonce = toHexQuantity(tx.nonce);
  }
  if (tx.gasLimit) {
    params.gas = toHexQuantity(tx.gasLimit);
  }
  if (tx.maxFeePerGas && tx.maxPriorityFeePerGas) {
    params.maxFeePerGas = toHexQuantity(tx.maxFeePerGas);
    params.maxPriorityFeePerGas = toHexQuantity(tx.maxPriorityFeePerGas);
  } else if (tx.gasPrice) {
    /*
     * Legacy path: Ledger still requires maxFee* to skip re-estimation, so it
     * will overwrite gas/fees with its own EIP-1559 estimate. We only forward
     * gasPrice for wallets that honor it; do not expect Rango's gasLimit to
     * stick on this path.
     */
    params.gasPrice = toHexQuantity(tx.gasPrice);
  }
  return params;
};

/*
 * Implement GenericSigner so signAndSendTx can return only `{ hash }` —
 * Ledger's eth_sendTransaction never yields an ethers TransactionResponse.
 * Delegate personal_sign / eth_signTypedData_v4 to DefaultEvmSigner (supported
 * by Ledger). Do not use its signAndSendTx: ethers then polls
 * eth_getTransactionByHash, which Ledger does not support.
 */
export class CustomEvmSigner implements GenericSigner<EvmTransaction> {
  private defaultEvmSigner: DefaultEvmSigner;

  constructor() {
    /*
     * Provider comes from the EIP-6963 announce stashed in ledgerProvider
     * (getSigners runs after connect, so it should already be set).
     */
    this.defaultEvmSigner = new DefaultEvmSigner(getProvider());
  }

  async signMessage(msg: string): Promise<string> {
    return await this.defaultEvmSigner.signMessage(msg);
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    return await this.defaultEvmSigner.signTypedData(typedData);
  }

  async signAndSendTx(
    tx: EvmTransaction,
    /*
     * Unused on purpose:
     *  - Ledger eth_sendTransaction does not validate tx.from against the
     *    selected account (unlike eth_signTypedData*), so an address check
     *    here cannot stop a wrong-account sign.
     *  - Network is enforced upstream by
     *    checkEnvironmentBeforeExecuteTransaction.
     */
    _address: string,
    _chainId: string | null
  ): Promise<{ hash: string }> {
    try {
      const provider = getProvider();

      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [buildLedgerTx(tx)],
      });

      return { hash };
    } catch (error) {
      throw cleanEvmError(error);
    }
  }

  /*
   * Tx is already broadcast; Ledger cannot serve getTransaction/receipts.
   * Return the hash so checkStatus can continue via the API watcher.
   */
  async wait(txHash: string): Promise<{ hash: string }> {
    return { hash: txHash };
  }
}
