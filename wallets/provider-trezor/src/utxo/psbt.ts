import type { SignTransaction } from '@trezor/connect-web';

import * as ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

import { resolveBitcoinScriptType } from './config.js';

// Lets bitcoinjs-lib decode taproot (witness v1) output addresses.
bitcoin.initEccLib(ecc);

type TrezorInput = SignTransaction['inputs'][number];
type TrezorOutput = SignTransaction['outputs'][number];

export interface TrezorBitcoinTransaction {
  inputs: TrezorInput[];
  outputs: TrezorOutput[];
  /** Transaction version from the PSBT — preserved so the signed tx matches Rango's. */
  version: number;
  /** Transaction locktime from the PSBT (e.g. for CLTV) — preserved as-is. */
  locktime: number;
}

const reverseTxid = (hash: Buffer) =>
  Buffer.from(hash).reverse().toString('hex');

/**
 * Translate Rango's unsigned PSBT into the transaction Trezor's `signTransaction` expects
 * (Trezor has no "sign this PSBT" call). Every field that affects the resulting bytes is
 * preserved: `version`, `locktime`, and per-input `sequence` (RBF / locktime signaling),
 * alongside each input's amount and script.
 *
 * Rango's PSBT carries no derivation data, so the connected `path` (and the script type
 * from its BIP-43 purpose) is applied to every input — Rango funds the swap from that
 * single address. `refTxs` are omitted: Trezor Connect fetches previous transactions from
 * its Blockbook backend. Pure function -> unit testable.
 *
 * Only SIGHASH_ALL is supported: a non-default per-input sighash can't be honored through
 * Trezor's signTransaction, so we reject it rather than sign the wrong thing. Multisig /
 * script-path spends are out of scope (Rango funds from a single-key address).
 */
export function buildTrezorBitcoinTransaction(
  unsignedPsbtBase64: string,
  path: string,
  network: bitcoin.Network = bitcoin.networks.bitcoin
): TrezorBitcoinTransaction {
  const psbt = bitcoin.Psbt.fromBase64(unsignedPsbtBase64, { network });
  const scriptType = resolveBitcoinScriptType(path);

  const inputs = psbt.txInputs.map((input, index): TrezorInput => {
    const data = psbt.data.inputs[index];

    if (
      data.sighashType != null &&
      data.sighashType !== bitcoin.Transaction.SIGHASH_ALL
    ) {
      throw new Error(
        `PSBT input #${index} uses sighash type ${data.sighashType}; only SIGHASH_ALL is supported.`
      );
    }

    const utxo =
      data.witnessUtxo ??
      bitcoin.Transaction.fromBuffer(data.nonWitnessUtxo as Buffer).outs[
        input.index
      ];
    return {
      // Trezor Connect accepts the path string directly (like our EVM signer).
      address_n: path,
      prev_hash: reverseTxid(input.hash),
      prev_index: input.index,
      amount: utxo.value.toString(),
      script_type: scriptType,
      sequence: input.sequence,
    };
  });

  const outputs = psbt.txOutputs.map(
    (output): TrezorOutput =>
      output.address
        ? {
            script_type: 'PAYTOADDRESS',
            address: output.address,
            amount: output.value.toString(),
          }
        : {
            script_type: 'PAYTOOPRETURN',
            amount: '0',
            op_return_data: (
              bitcoin.script.decompile(output.script)?.find(Buffer.isBuffer) ??
              Buffer.alloc(0)
            ).toString('hex'),
          }
  );

  return { inputs, outputs, version: psbt.version, locktime: psbt.locktime };
}
