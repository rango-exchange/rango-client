/* eslint-disable @typescript-eslint/no-magic-numbers */
import * as ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import { describe, expect, it } from 'vitest';

import { buildTrezorBitcoinTransaction } from './psbt.js';

bitcoin.initEccLib(ecc);
const NETWORK = bitcoin.networks.bitcoin;

const PRIVATE_KEY = Buffer.alloc(32, 7);
const PUBKEY = Buffer.from(
  ecc.pointFromScalar(PRIVATE_KEY, true) as Uint8Array
);
const { address: OWN_ADDRESS } = bitcoin.payments.p2wpkh({
  pubkey: PUBKEY,
  network: NETWORK,
});

const NATIVE_SEGWIT_PATH = "m/84'/0'/0'/0/0";

// Non-palindromic on purpose, so the txid byte-reversal is actually exercised.
const FAKE_PREV_TXID =
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const RECIPIENT = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';

function nativeSegwitInput() {
  const witnessScript = bitcoin.payments.p2wpkh({
    pubkey: PUBKEY,
    network: NETWORK,
  }).output as Buffer;
  return {
    hash: FAKE_PREV_TXID,
    index: 0,
    witnessUtxo: { script: witnessScript, value: 100_000 },
  };
}

describe('buildTrezorBitcoinTransaction', () => {
  it('maps each input to the connected path and its script type', () => {
    const psbt = new bitcoin.Psbt({ network: NETWORK });
    psbt.addInput(nativeSegwitInput());
    psbt.addOutput({ address: RECIPIENT, value: 90_000 });

    const { inputs } = buildTrezorBitcoinTransaction(
      psbt.toBase64(),
      NATIVE_SEGWIT_PATH,
      NETWORK
    );

    expect(inputs).toHaveLength(1);
    expect(inputs[0].address_n).toBe(NATIVE_SEGWIT_PATH);
    expect(inputs[0].script_type).toBe('SPENDWITNESS');
    expect(inputs[0].prev_hash).toBe(FAKE_PREV_TXID);
    expect(inputs[0].prev_index).toBe(0);
    expect(inputs[0].amount).toBe('100000');
  });

  it('preserves version, locktime and per-input sequence from the PSBT', () => {
    const psbt = new bitcoin.Psbt({ network: NETWORK });
    psbt.setVersion(2);
    psbt.setLocktime(800_000);
    // RBF-signaling sequence.
    psbt.addInput({ ...nativeSegwitInput(), sequence: 0xfffffffd });
    psbt.addOutput({ address: RECIPIENT, value: 90_000 });

    const { inputs, version, locktime } = buildTrezorBitcoinTransaction(
      psbt.toBase64(),
      NATIVE_SEGWIT_PATH,
      NETWORK
    );

    expect(version).toBe(2);
    expect(locktime).toBe(800_000);
    expect(inputs[0].sequence).toBe(0xfffffffd);
  });

  it('rejects an input with a non-SIGHASH_ALL sighash type', () => {
    const psbt = new bitcoin.Psbt({ network: NETWORK });
    psbt.addInput({
      ...nativeSegwitInput(),
      sighashType: bitcoin.Transaction.SIGHASH_SINGLE,
    });
    psbt.addOutput({ address: RECIPIENT, value: 90_000 });

    expect(() =>
      buildTrezorBitcoinTransaction(
        psbt.toBase64(),
        NATIVE_SEGWIT_PATH,
        NETWORK
      )
    ).toThrow(/only SIGHASH_ALL is supported/);
  });

  it('reconstructs outputs as address payments', () => {
    const psbt = new bitcoin.Psbt({ network: NETWORK });
    psbt.addInput(nativeSegwitInput());
    psbt.addOutput({ address: RECIPIENT, value: 60_000 });
    psbt.addOutput({ address: OWN_ADDRESS as string, value: 39_000 });

    const { outputs } = buildTrezorBitcoinTransaction(
      psbt.toBase64(),
      NATIVE_SEGWIT_PATH,
      NETWORK
    );

    expect(outputs).toEqual([
      { script_type: 'PAYTOADDRESS', address: RECIPIENT, amount: '60000' },
      { script_type: 'PAYTOADDRESS', address: OWN_ADDRESS, amount: '39000' },
    ]);
  });

  it('derives the script type from the path purpose (legacy P2PKH)', () => {
    const p2pkh = bitcoin.payments.p2pkh({ pubkey: PUBKEY, network: NETWORK });

    // A previous transaction that funds the legacy address at vout 0.
    const prevTx = new bitcoin.Transaction();
    prevTx.version = 2;
    prevTx.addInput(Buffer.alloc(32, 1), 0);
    prevTx.addOutput(p2pkh.output as Buffer, 100_000);

    const psbt = new bitcoin.Psbt({ network: NETWORK });
    psbt.addInput({
      hash: prevTx.getId(),
      index: 0,
      nonWitnessUtxo: prevTx.toBuffer(),
    });
    psbt.addOutput({ address: RECIPIENT, value: 90_000 });

    const { inputs } = buildTrezorBitcoinTransaction(
      psbt.toBase64(),
      "m/44'/0'/0'/0/0",
      NETWORK
    );

    expect(inputs[0].script_type).toBe('SPENDADDRESS');
    expect(inputs[0].amount).toBe('100000');
  });

  it('encodes an OP_RETURN output as PAYTOOPRETURN', () => {
    const memo = Buffer.from('rango', 'utf8');
    const psbt = new bitcoin.Psbt({ network: NETWORK });
    psbt.addInput(nativeSegwitInput());
    psbt.addOutput({ address: RECIPIENT, value: 90_000 });
    psbt.addOutput({
      script: bitcoin.payments.embed({ data: [memo] }).output as Buffer,
      value: 0,
    });

    const { outputs } = buildTrezorBitcoinTransaction(
      psbt.toBase64(),
      NATIVE_SEGWIT_PATH,
      NETWORK
    );

    expect(outputs[1]).toEqual({
      script_type: 'PAYTOOPRETURN',
      amount: '0',
      op_return_data: memo.toString('hex'),
    });
  });
});
