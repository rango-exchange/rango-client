import type { NamespaceInputForConnect } from '../legacy/types.js';

import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { Err, Ok } from 'ts-results';
import { describe, expect, it } from 'vitest';

import { WalletConnectionAttemptError } from '../errors.js';

import { runConnectionAttempt } from './helpers.js';

const connected = new Ok({ accounts: [], network: null });

const SOLANA_DERIVATION_PATH = "m/44'/501'/0'/0'";
const evm: NamespaceInputForConnect = { namespace: 'EVM', network: 'ETH' };
const solana: NamespaceInputForConnect = {
  namespace: 'Solana',
  network: undefined,
  derivationPath: SOLANA_DERIVATION_PATH,
};
const sui: NamespaceInputForConnect = { namespace: 'Sui', network: undefined };
const requestedNamespaces = [evm, solana, sui];

function rejection() {
  return Object.assign(new Error('User rejected the request.'), {
    code: USER_REJECTION_ERROR_CODE,
  });
}

async function catchAttemptError(
  ...args: Parameters<typeof runConnectionAttempt>
): Promise<WalletConnectionAttemptError> {
  const thrown: unknown = await runConnectionAttempt(...args).then(
    () => undefined,
    (error: unknown) => error
  );
  expect(thrown).toBeInstanceOf(WalletConnectionAttemptError);
  return thrown as WalletConnectionAttemptError;
}

describe('runConnectionAttempt', () => {
  it('list each requested namespace with the network and derivation path passed for it including cancelled ones', async () => {
    const error = await catchAttemptError(
      requestedNamespaces,
      async (reportAttempts) => {
        reportAttempts([
          { input: evm, result: new Err(rejection()) },
          { input: solana, result: new Err(rejection()), cancelled: true },
          { input: sui, result: new Err(rejection()), cancelled: true },
        ]);
      }
    );

    expect(error.requestedNamespaces).toEqual([
      { namespace: 'EVM', network: 'ETH' },
      {
        namespace: 'Solana',
        network: undefined,
        derivationPath: SOLANA_DERIVATION_PATH,
      },
      { namespace: 'Sui', network: undefined },
    ]);
    expect(error.errors).toHaveLength(1);
    expect(error.errors[0]).toMatchObject({ namespace: 'EVM' });
  });

  it('add a config error thrown before any namespace is tried as the only entry without wrapping it', async () => {
    const configError = new Error(
      "You should add phantom to provider first then call 'connect'."
    );

    const error = await catchAttemptError(requestedNamespaces, async () => {
      throw configError;
    });

    expect(error.errors).toHaveLength(1);
    expect(error.errors[0]).toBe(configError);
    expect(error.message).toBe(configError.message);
    expect(error.requestedNamespaces.map(({ namespace }) => namespace)).toEqual(
      ['EVM', 'Solana', 'Sui']
    );
  });

  it('list no requested namespaces when none were passed', async () => {
    const configError = new Error(
      'Passing namespace to `connect` is required.'
    );

    const error = await catchAttemptError(undefined, async () => {
      throw configError;
    });

    expect(error.errors).toEqual([configError]);
    expect(error.requestedNamespaces).toEqual([]);
  });

  it('add a value thrown once the namespaces have settled after their failures without wrapping it', async () => {
    const storageError = new Error('QuotaExceededError');

    const error = await catchAttemptError(
      requestedNamespaces,
      async (reportAttempts) => {
        reportAttempts([
          { input: evm, result: new Err(new Error('EVM failed')) },
          { input: solana, result: connected },
          { input: sui, result: connected },
        ]);
        throw storageError;
      }
    );

    expect(error.errors).toHaveLength(2);
    expect(error.errors[0]).toMatchObject({ namespace: 'EVM' });
    expect(error.errors[1]).toBe(storageError);
  });

  it('add a thrown undefined as the only entry', async () => {
    const error = await catchAttemptError(requestedNamespaces, async () => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw undefined;
    });

    expect(error.errors).toEqual([undefined]);
  });

  it('return each namespace result in request order when every namespace connected', async () => {
    const results = await runConnectionAttempt(
      [evm, solana],
      async (reportAttempts) => {
        reportAttempts([
          { input: evm, result: new Ok('evm accounts') },
          { input: solana, result: new Ok('solana accounts') },
        ]);
      }
    );

    expect(results).toEqual(['evm accounts', 'solana accounts']);
  });
});
