import type { EvmActions, ProviderAPI } from '@hub3js/evm';
import type { EvmTransaction } from 'rango-sdk';

import { createStore, NamespaceBuilder, ProviderBuilder } from '@hub3js/core';
import { viemWalletAdapter } from '@hub3js/evm';
import {
  RPCErrorCode,
  SignerError,
  SignerErrorCode,
  TransactionType,
} from 'rango-types';
import { describe, expect, test, vi } from 'vitest';

import { sendEvmTransaction } from './evm';

const ADDRESS = '0x1111111111111111111111111111111111111111';
const TO = '0x2222222222222222222222222222222222222222';
const HASH_BYTES = 32;
const TEST_WALLET_METADATA = {
  name: 'Test Wallet',
  icon: 'https://example.com/icon.svg',
  extensions: { homepage: 'https://example.com' },
};
const HASH = `0x${'ab'.repeat(HASH_BYTES)}`;

function createEvmTransaction(
  overrides: Partial<EvmTransaction> = {}
): EvmTransaction {
  return {
    type: TransactionType.EVM,
    blockChain: 'ETH',
    isApprovalTx: false,
    from: ADDRESS,
    to: TO,
    data: '0xabcdef',
    value: null,
    nonce: null,
    gasLimit: '21000',
    gasPrice: null,
    maxFeePerGas: '30000000000',
    maxPriorityFeePerGas: '1000000000',
    prerequisites: [],
    ...overrides,
  };
}

/**
 * A namespace with viem's wallet actions over a fake EIP-1193 provider, so the
 * exact `eth_sendTransaction` params can be asserted.
 */
function createNamespace(
  sendTransaction: (params: unknown) => unknown = () => HASH
) {
  const request = vi.fn(
    async ({ method, params }: { method: string; params?: unknown[] }) => {
      if (method === 'eth_sendTransaction') {
        return sendTransaction(params?.[0]);
      }
      if (method === 'eth_chainId') {
        return '0x1';
      }
      throw new Error(`Unexpected method: ${method}`);
    }
  );
  const instance = { request } as unknown as ProviderAPI;

  const evm = new NamespaceBuilder<EvmActions>('EVM', 'test-wallet')
    .action('getChainId', async () => '0x1')
    .action(viemWalletAdapter(() => instance))
    .build();
  const provider = new ProviderBuilder('test-wallet', {
    store: createStore(),
  })
    .config('metadata', TEST_WALLET_METADATA)
    .add('evm', evm)
    .build();
  provider.init();

  const [, setState] = evm.state();
  setState('connected', true);
  setState('accounts', [`eip155:1:${ADDRESS}`]);
  setState('network', '0x1');

  return { namespace: evm, request };
}

function sentParams(request: ReturnType<typeof vi.fn>) {
  return request.mock.calls
    .map(([args]) => args)
    .filter(({ method }) => method === 'eth_sendTransaction')
    .map(({ params }) => params[0]);
}

describe('sendEvmTransaction', () => {
  test('sends hex quantities, gas and an explicit zero value', async () => {
    const { namespace, request } = createNamespace();

    const result = await sendEvmTransaction(
      namespace,
      createEvmTransaction(),
      ADDRESS,
      '1'
    );

    expect(result).toEqual({ hash: HASH });
    expect(sentParams(request)).toEqual([
      {
        from: ADDRESS,
        to: TO,
        data: '0xabcdef',
        value: '0x0',
        gas: '0x5208',
        maxFeePerGas: '0x6fc23ac00',
        maxPriorityFeePerGas: '0x3b9aca00',
      },
    ]);
  });

  test('sends a legacy gas price and a nonce when given', async () => {
    const { namespace, request } = createNamespace();

    await sendEvmTransaction(
      namespace,
      createEvmTransaction({
        value: '1000',
        nonce: '7',
        gasPrice: '20000000000',
        maxFeePerGas: null,
        maxPriorityFeePerGas: null,
      }),
      ADDRESS,
      '1'
    );

    expect(sentParams(request)[0]).toMatchObject({
      value: '0x3e8',
      nonce: '0x7',
      gasPrice: '0x4a817c800',
    });
  });

  test('retries without EIP-1559 fees when the wallet rejects them', async () => {
    let attempts = 0;
    const { namespace, request } = createNamespace(() => {
      attempts++;
      if (attempts === 1) {
        throw new Error('EIP-1559 is not supported');
      }
      return HASH;
    });

    await sendEvmTransaction(
      namespace,
      createEvmTransaction({ gasPrice: '20000000000' }),
      ADDRESS,
      '1'
    );

    const [first, retry] = sentParams(request);
    expect(first).toHaveProperty('maxFeePerGas');
    expect(retry).not.toHaveProperty('maxFeePerGas');
    expect(retry).toMatchObject({ gasPrice: '0x4a817c800' });
  });

  test('reports a user rejection as a rejection', async () => {
    const { namespace } = createNamespace(() => {
      throw Object.assign(new Error('User rejected the request.'), {
        code: 4001,
      });
    });

    const error = await sendEvmTransaction(
      namespace,
      createEvmTransaction(),
      ADDRESS,
      '1'
    ).catch((error: unknown) => error);

    expect(SignerError.isSignerError(error)).toBe(true);
    expect((error as SignerError).rpcCode).toBe(RPCErrorCode.REJECTION);
  });

  test("refuses to send when the wallet's chain doesn't match", async () => {
    const { namespace, request } = createNamespace();

    const error = await sendEvmTransaction(
      namespace,
      createEvmTransaction(),
      ADDRESS,
      '137'
    ).catch((error: unknown) => error);

    expect((error as SignerError).code).toBe(
      SignerErrorCode.UNEXPECTED_BEHAVIOUR
    );
    expect((error as SignerError).getErrorDetail().detail).toMatch(
      /doesn't match with required chainId/
    );
    expect(sentParams(request)).toHaveLength(0);
  });

  test("refuses to send when the wallet's address doesn't match", async () => {
    const { namespace, request } = createNamespace();

    const error = await sendEvmTransaction(
      namespace,
      createEvmTransaction(),
      '0x3333333333333333333333333333333333333333',
      '1'
    ).catch((error: unknown) => error);

    expect((error as SignerError).code).toBe(
      SignerErrorCode.UNEXPECTED_BEHAVIOUR
    );
    expect((error as SignerError).getErrorDetail().detail).toMatch(
      /doesn't match with required address/
    );
    expect(sentParams(request)).toHaveLength(0);
  });
});
