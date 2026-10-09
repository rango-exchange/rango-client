/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Transfer } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';
import { describe, expect, it, vi } from 'vitest';

import { BTCSigner } from './utxoSigner.js';

const transfer = {
  asset: { blockchain: 'BTC', symbol: 'BTC', address: null },
  psbt: { unsignedPsbtBase64: '', inputsToSign: [] },
} as unknown as Transfer;

describe('unisat utxo signer', () => {
  it('read a 4001 rejection from the wallet as a rejection', async () => {
    const rejection = { code: 4001, message: 'User rejected the request.' };
    const signer = new BTCSigner({
      getChain: vi.fn(async () => ({ enum: 'BITCOIN_MAINNET' })),
      signPsbt: vi.fn(async () => Promise.reject(rejection)),
    });

    const error = await signer.signAndSendTx(transfer).catch((e) => e);

    expect(error).toBeInstanceOf(SignerError);
    expect(error.code).toBe(SignerErrorCode.REJECTED_BY_USER);
  });

  it('read any other wallet error as a send failure', async () => {
    const failure = new Error('Something broke in the wallet');
    const signer = new BTCSigner({
      getChain: vi.fn(async () => ({ enum: 'BITCOIN_MAINNET' })),
      signPsbt: vi.fn(async () => Promise.reject(failure)),
    });

    const error = await signer.signAndSendTx(transfer).catch((e) => e);

    expect(error).toBeInstanceOf(SignerError);
    expect(error.code).toBe(SignerErrorCode.SEND_TX_ERROR);
    expect(error.root).toBe(failure);
  });
});
