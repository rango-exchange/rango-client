import type { SolanaNamespace } from './solana';
import type { SolanaTransaction } from 'rango-types';

import {
  RPCErrorCode,
  SignerError,
  SignerErrorCode,
  TransactionType,
} from 'rango-types';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { sendSolanaTransaction } from './solana';

const ADDRESS = '7Y9dmSWKq3Nn6Lc2CLLFPbrhHnRZdSmJ7Q3uHvT1Cjc4';
const HASH =
  '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW';
const TRANSACTION_LENGTH = 3;
const UNSIGNED_BYTE = 1;
const SIGNED_BYTE = 2;
const UNSIGNED = new Uint8Array(TRANSACTION_LENGTH).fill(UNSIGNED_BYTE);
const SIGNED = new Uint8Array(TRANSACTION_LENGTH).fill(SIGNED_BYTE);
const USER_REJECTED_REQUEST_CODE = 4001;

/*
 * Stands in for signer-solana's pipeline: it hands a prepared v0 transaction
 * to the signer and resolves with the hash once the signed bytes are sent.
 */
const executor: { sent: Uint8Array | null } = vi.hoisted(() => ({
  sent: null,
}));
vi.mock('@rango-dev/signer-solana', () => ({
  generalSolanaTransactionExecutor: vi.fn(
    async (
      _tx: unknown,
      sign: (transaction: unknown) => Promise<Uint8Array>
    ) => {
      executor.sent = await sign({ version: 0, serialize: () => UNSIGNED });
      return HASH;
    }
  ),
}));

function createSolanaTransaction(
  overrides: Partial<SolanaTransaction> = {}
): SolanaTransaction {
  return {
    type: TransactionType.SOLANA,
    blockChain: 'SOLANA',
    from: ADDRESS,
    identifier: 'swap',
    instructions: [],
    recentBlockhash: null,
    signatures: [],
    serializedMessage: null,
    txType: 'VERSIONED',
    ...overrides,
  } as SolanaTransaction;
}

function createNamespace(
  signTransaction: (...inputs: unknown[]) => Promise<unknown>
) {
  return { signTransaction: vi.fn(signTransaction) };
}

describe('sendSolanaTransaction', () => {
  beforeEach(() => {
    executor.sent = null;
  });

  test('signs the prepared transaction through the namespace and returns its hash', async () => {
    const namespace = createNamespace(async () => [
      { signedTransaction: SIGNED },
    ]);

    const result = await sendSolanaTransaction(
      namespace as unknown as SolanaNamespace,
      createSolanaTransaction(),
      ADDRESS
    );

    expect(namespace.signTransaction).toHaveBeenCalledWith({
      transaction: UNSIGNED,
    });
    expect(executor.sent).toBe(SIGNED);
    expect(result).toEqual({ hash: HASH });
  });

  test("rejects when the transaction isn't from the connected address", async () => {
    const namespace = createNamespace(async () => []);

    await expect(
      sendSolanaTransaction(
        namespace as unknown as SolanaNamespace,
        createSolanaTransaction({ from: 'another-address' }),
        ADDRESS
      )
    ).rejects.toMatchObject({ code: SignerErrorCode.SIGN_TX_ERROR });
    expect(namespace.signTransaction).not.toHaveBeenCalled();
  });

  test('reports a declined signing as rejected by the user', async () => {
    const namespace = createNamespace(async () => {
      throw Object.assign(new Error('User rejected the request.'), {
        code: USER_REJECTED_REQUEST_CODE,
      });
    });

    const error = await sendSolanaTransaction(
      namespace as unknown as SolanaNamespace,
      createSolanaTransaction(),
      ADDRESS
    ).catch((caught: unknown) => caught);

    expect(SignerError.isSignerError(error)).toBe(true);
    expect(error).toMatchObject({
      code: SignerErrorCode.REJECTED_BY_USER,
      rpcCode: RPCErrorCode.REJECTION,
    });
  });

  test('rejects a wallet without the sign action', async () => {
    await expect(
      sendSolanaTransaction(
        {} as unknown as SolanaNamespace,
        createSolanaTransaction(),
        ADDRESS
      )
    ).rejects.toThrow();
  });
});
