import type { Provider } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { TronTransaction, TrxRawData } from 'rango-sdk';
import type {
  EvmApprovePrerequisite,
  TransactionPrerequisiteResult,
  TronApprovePrerequisite,
} from 'rango-types';

import { utils } from '@hub3js/evm';
import {
  EVM_APPROVE_TYPE,
  SignerError,
  SignerErrorCode,
  TransactionType,
  TRON_APPROVE_TYPE,
} from 'rango-types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { REQUIRED_ALLOWANCE_CONFIRMATIONS } from '../../../src/execution/actions/runPrerequisite/executeApprovePrerequisite/constants';
import { runPrerequisite } from '../../../src/execution/actions/runPrerequisite/runPrerequisite';
import {
  blocked,
  CHAIN_IDS,
  contextFor,
  execution,
  failure,
  type FakeEvmActions,
  fakeEvmNamespace,
  fakeNamespace,
  type FakeNamespaceState,
  fakeProvider,
  fakeSigner,
  transaction,
} from '../fakes';

const TOKEN = '0x1111111111111111111111111111111111111111';
const SPENDER = '0x2222222222222222222222222222222222222222';
const OWNER = '0x3333333333333333333333333333333333333333';

const evmPrerequisite: EvmApprovePrerequisite = {
  type: EVM_APPROVE_TYPE,
  blockChain: 'ARBITRUM',
  wallet: OWNER,
  token: TOKEN,
  spender: SPENDER,
  amount: '1000',
};

const tronPrerequisite: TronApprovePrerequisite = {
  type: TRON_APPROVE_TYPE,
  blockChain: 'TRON',
  wallet: OWNER,
  token: TOKEN,
  spender: SPENDER,
  amount: '1000',
};

const evmTx = transaction([evmPrerequisite]);
const tronTx = transaction([tronPrerequisite]);

const params = { stepIndex: 0, prerequisiteIndex: 0 };
const failed = (code: string) => failure(code, 'run_prerequisites');

const pendingResult = (
  prerequisiteType: typeof EVM_APPROVE_TYPE | typeof TRON_APPROVE_TYPE
): TransactionPrerequisiteResult => ({
  prerequisiteIndex: 0,
  prerequisiteType,
  status: 'pending',
  data: { executedTransactionHash: 'TXHASH' },
});

/** Runs the action with fake timers, so the allowance confirmation waits do not take real time. */
async function runWithTimers(
  exec: ReturnType<typeof execution>,
  provider: Provider<DefaultNamespaces> | undefined
) {
  const promise = runPrerequisite(exec, contextFor(provider), params);
  await vi.runAllTimersAsync();
  return promise;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('EVM approve', () => {
  function provider(
    evm: FakeEvmActions,
    signer = fakeSigner(),
    state?: FakeNamespaceState
  ) {
    return fakeProvider({
      namespaces: { evm: fakeEvmNamespace(evm, state) },
      signer,
    });
  }

  it('skips when the allowance already covers the amount', async () => {
    const getAllowance = vi.fn().mockResolvedValue('1000');
    const signAndSendTx = vi.fn();

    const transitions = await runPrerequisite(
      execution(evmTx),
      contextFor(provider({ getAllowance }, fakeSigner(signAndSendTx))),
      params
    );

    expect(getAllowance).toHaveBeenCalledWith({
      token: TOKEN,
      owner: OWNER,
      spender: SPENDER,
    });
    expect(transitions).toEqual([
      {
        type: 'prerequisite_updated',
        stepIndex: 0,
        result: {
          prerequisiteIndex: 0,
          prerequisiteType: EVM_APPROVE_TYPE,
          status: 'skipped',
          data: null,
        },
      },
    ]);
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it('fails when the wallet cannot read allowances, since nobody else approves', async () => {
    const signAndSendTx = vi.fn();

    const transitions = await runPrerequisite(
      execution(evmTx),
      contextFor(provider({}, fakeSigner(signAndSendTx))),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it('signs an approve and records it as pending when the allowance is short', async () => {
    const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });

    const transitions = await runPrerequisite(
      execution(evmTx),
      contextFor(
        provider(
          { getAllowance: vi.fn().mockResolvedValue('999') },
          fakeSigner(signAndSendTx)
        )
      ),
      params
    );

    expect(signAndSendTx).toHaveBeenCalledWith(
      {
        type: TransactionType.EVM,
        blockChain: 'ARBITRUM',
        prerequisites: [],
        isApprovalTx: true,
        from: OWNER,
        to: TOKEN,
        data: utils.encodeApproveCallData(SPENDER, '1000'),
        value: null,
        nonce: null,
        gasLimit: null,
        gasPrice: null,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      },
      '0xWALLET',
      CHAIN_IDS.ARBITRUM
    );
    expect(transitions).toEqual([
      {
        type: 'prerequisite_updated',
        stepIndex: 0,
        result: {
          prerequisiteIndex: 0,
          prerequisiteType: EVM_APPROVE_TYPE,
          status: 'pending',
          data: { executedTransactionHash: 'TXHASH' },
        },
      },
    ]);
  });

  it('fails when the allowance cannot be read', async () => {
    const transitions = await runPrerequisite(
      execution(evmTx),
      contextFor(
        provider({ getAllowance: vi.fn().mockRejectedValue(new Error('rpc')) })
      ),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it('fails with the signer code when the wallet rejects', async () => {
    const signAndSendTx = vi
      .fn()
      .mockRejectedValue(new SignerError(SignerErrorCode.REJECTED_BY_USER));

    const transitions = await runPrerequisite(
      execution(evmTx),
      contextFor(
        provider(
          { getAllowance: vi.fn().mockResolvedValue('0') },
          fakeSigner(signAndSendTx)
        )
      ),
      params
    );

    expect(transitions).toMatchObject(failed('REJECTED_BY_USER'));
  });

  it('parks the step before reading the allowance when the wallet is disconnected', async () => {
    const getAllowance = vi.fn();
    const signAndSendTx = vi.fn();

    const transitions = await runPrerequisite(
      execution(evmTx),
      contextFor(
        provider({ getAllowance }, fakeSigner(signAndSendTx), {
          connected: false,
        })
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({ reason: 'wallet_disconnected', walletType: 'metamask' })
    );
    expect(getAllowance).not.toHaveBeenCalled();
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it('switches the wallet to the chain before reading the allowance', async () => {
    const getAllowance = vi.fn().mockResolvedValue('1000');
    const connect = vi.fn().mockResolvedValue({ accounts: [], network: '' });
    const getChainId = vi
      .fn()
      .mockResolvedValueOnce('0x1')
      .mockResolvedValue(CHAIN_IDS.ARBITRUM);

    const transitions = await runPrerequisite(
      execution(evmTx),
      contextFor(provider({ getAllowance, connect, getChainId })),
      params
    );

    expect(connect).toHaveBeenCalledOnce();
    expect(connect.mock.invocationCallOrder[0]).toBeLessThan(
      getAllowance.mock.invocationCallOrder[0]
    );
    expect(transitions).toMatchObject([
      { type: 'prerequisite_updated', result: { status: 'skipped' } },
    ]);
  });

  it('parks the step when the wallet cannot be switched to the chain', async () => {
    const getAllowance = vi.fn();

    const transitions = await runPrerequisite(
      execution(evmTx),
      contextFor(
        provider({
          getAllowance,
          getChainId: vi.fn().mockResolvedValue('0x1'),
          canSwitchNetwork: vi.fn().mockReturnValue(false),
        })
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({
        reason: 'wrong_network',
        walletType: 'metamask',
        namespace: 'EVM',
        network: 'ARBITRUM',
        switch: null,
      })
    );
    expect(getAllowance).not.toHaveBeenCalled();
  });

  describe('with a pending approve', () => {
    const pending = pendingResult(EVM_APPROVE_TYPE);

    it('polls the transaction without needing the wallet to be ready', async () => {
      const getTransactionReceipt = vi.fn().mockResolvedValue(null);

      const transitions = await runWithTimers(
        execution(evmTx, [pending]),
        provider({ getAllowance: vi.fn(), getTransactionReceipt }, undefined, {
          connected: false,
        })
      );

      expect(getTransactionReceipt).toHaveBeenCalledWith('TXHASH');
      expect(transitions).toEqual([]);
    });

    it('reports nothing while the transaction has no receipt', async () => {
      const getAllowance = vi.fn();

      const transitions = await runWithTimers(
        execution(evmTx, [pending]),
        provider({
          getAllowance,
          getTransactionReceipt: vi.fn().mockResolvedValue(null),
        })
      );

      expect(transitions).toEqual([]);
      expect(getAllowance).not.toHaveBeenCalled();
    });

    it('records failure when the transaction reverted', async () => {
      const transitions = await runWithTimers(
        execution(evmTx, [pending]),
        provider({
          getAllowance: vi.fn(),
          getTransactionReceipt: vi.fn().mockResolvedValue({ status: '0x0' }),
        })
      );

      expect(transitions).toEqual([
        {
          type: 'prerequisite_updated',
          stepIndex: 0,
          result: { ...pending, status: 'failed' },
        },
      ]);
    });

    it.each(['0x1', '0x01', '1'])(
      'records success once the receipt reads %s and two allowance reads agree',
      async (status) => {
        const getAllowance = vi
          .fn()
          .mockResolvedValueOnce('0')
          .mockResolvedValue('1000');

        const transitions = await runWithTimers(
          execution(evmTx, [pending]),
          provider({
            getAllowance,
            getTransactionReceipt: vi.fn().mockResolvedValue({ status }),
          })
        );

        expect(getAllowance).toHaveBeenCalledTimes(
          REQUIRED_ALLOWANCE_CONFIRMATIONS + 1
        );
        expect(transitions).toEqual([
          {
            type: 'prerequisite_updated',
            stepIndex: 0,
            result: { ...pending, status: 'success' },
          },
        ]);
      }
    );

    it('fails with INSUFFICIENT_APPROVE when the allowance stays short after mining', async () => {
      const getAllowance = vi.fn().mockResolvedValue('999');

      const transitions = await runWithTimers(
        execution(evmTx, [pending]),
        provider({
          getAllowance,
          getTransactionReceipt: vi.fn().mockResolvedValue({ status: '0x1' }),
        })
      );

      expect(getAllowance.mock.calls.length).toBeGreaterThan(
        REQUIRED_ALLOWANCE_CONFIRMATIONS
      );
      expect(transitions).toMatchObject(failed('INSUFFICIENT_APPROVE'));
    });

    it('throws for the loop to retry when the receipt cannot be read', async () => {
      const promise = runPrerequisite(
        execution(evmTx, [pending]),
        contextFor(
          provider({
            getAllowance: vi.fn(),
            getTransactionReceipt: vi.fn().mockRejectedValue(new Error('rpc')),
          })
        ),
        params
      );

      await expect(promise).rejects.toThrow('rpc');
    });

    it('fails when the wallet cannot read allowances any more', async () => {
      const transitions = await runWithTimers(
        execution(evmTx, [pending]),
        provider({})
      );

      expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
    });
  });
});

describe('Tron approve', () => {
  const rawData: TrxRawData = {
    contract: [],
    ref_block_bytes: '',
    ref_block_hash: '',
    expiration: 0,
    timestamp: 0,
  };
  const built = {
    txID: 'TXID',
    raw_data: rawData,
    raw_data_hex: 'HEX',
    visible: true,
    __payload__: { contract_address: TOKEN },
  };

  function provider(
    tron: Partial<{
      getAllowance: unknown;
      buildApproveTransaction: unknown;
      getTransactionInfo: unknown;
    }>,
    signer = fakeSigner()
  ) {
    return fakeProvider({ namespaces: { tron }, signer });
  }

  it('builds the approve through the node and records it as pending', async () => {
    const buildApproveTransaction = vi.fn().mockResolvedValue(built);
    const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });

    const transitions = await runPrerequisite(
      execution(tronTx),
      contextFor(
        provider(
          {
            getAllowance: vi.fn().mockResolvedValue('0'),
            buildApproveTransaction,
          },
          fakeSigner(signAndSendTx)
        )
      ),
      params
    );

    expect(buildApproveTransaction).toHaveBeenCalledWith({
      token: TOKEN,
      owner: OWNER,
      spender: SPENDER,
      amount: '1000',
    });
    const expectedTx: TronTransaction = {
      type: TransactionType.TRON,
      blockChain: 'TRON',
      prerequisites: [],
      isApprovalTx: true,
      raw_data: rawData,
      raw_data_hex: 'HEX',
      txID: 'TXID',
      visible: true,
      __payload__: built.__payload__,
    };
    expect(signAndSendTx).toHaveBeenCalledWith(
      expectedTx,
      '0xTRONWALLET',
      CHAIN_IDS.TRON
    );
    expect(transitions).toMatchObject([
      {
        type: 'prerequisite_updated',
        result: {
          prerequisiteType: TRON_APPROVE_TYPE,
          status: 'pending',
          data: { executedTransactionHash: 'TXHASH' },
        },
      },
    ]);
  });

  it('parks the step before reading the allowance when the wallet is disconnected', async () => {
    const getAllowance = vi.fn();

    const transitions = await runPrerequisite(
      execution(tronTx),
      contextFor(
        fakeProvider({
          namespaces: {
            tron: fakeNamespace({ getAllowance }, { connected: false }),
          },
        })
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({ reason: 'wallet_disconnected', walletType: 'tronlink' })
    );
    expect(getAllowance).not.toHaveBeenCalled();
  });

  it('fails when the node cannot build the approve', async () => {
    const transitions = await runPrerequisite(
      execution(tronTx),
      contextFor(
        provider({
          getAllowance: vi.fn().mockResolvedValue('0'),
          buildApproveTransaction: vi.fn().mockRejectedValue(new Error('node')),
        })
      ),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  describe('with a pending approve', () => {
    const pending = pendingResult(TRON_APPROVE_TYPE);

    it.each([
      ['empty info', {}],
      ['info without a block', { receipt: { result: 'SUCCESS' } }],
    ])('reports nothing while the node returns %s', async (_, info) => {
      const transitions = await runWithTimers(
        execution(tronTx, [pending]),
        provider({
          getAllowance: vi.fn(),
          getTransactionInfo: vi.fn().mockResolvedValue(info),
        })
      );

      expect(transitions).toEqual([]);
    });

    it('records failure when the included transaction carries a failure code', async () => {
      const transitions = await runWithTimers(
        execution(tronTx, [pending]),
        provider({
          getAllowance: vi.fn(),
          getTransactionInfo: vi.fn().mockResolvedValue({
            blockNumber: 5,
            receipt: { result: 'REVERT' },
          }),
        })
      );

      expect(transitions).toEqual([
        {
          type: 'prerequisite_updated',
          stepIndex: 0,
          result: { ...pending, status: 'failed' },
        },
      ]);
    });

    it.each([
      ['no result code', { blockNumber: 5 }],
      ['SUCCESS', { blockNumber: 5, receipt: { result: 'SUCCESS' } }],
    ])(
      'records success once included with %s and the allowance is confirmed',
      async (_, info) => {
        const transitions = await runWithTimers(
          execution(tronTx, [pending]),
          provider({
            getAllowance: vi.fn().mockResolvedValue('1000'),
            getTransactionInfo: vi.fn().mockResolvedValue(info),
          })
        );

        expect(transitions).toEqual([
          {
            type: 'prerequisite_updated',
            stepIndex: 0,
            result: { ...pending, status: 'success' },
          },
        ]);
      }
    );
  });
});
