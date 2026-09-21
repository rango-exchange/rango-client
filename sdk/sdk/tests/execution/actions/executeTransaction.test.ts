import type { SwapExecution } from '../../../src/execution/types';

import { SignerError, SignerErrorCode, TransactionType } from 'rango-types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { executeTransaction } from '../../../src/execution/actions/executeTransaction/mod';
import { HYPERLIQUID_EXCHANGE_API_URL } from '../../../src/execution/actions/hyperliquid/mod';
import {
  account,
  BLOCKCHAINS,
  blocked,
  CHAIN_IDS,
  contextFor,
  execution,
  failure,
  fakeEvmNamespace,
  fakeNamespace,
  fakeProvider,
  fakeSigner,
  HYPERLIQUID_SIGNATURE,
  HYPERLIQUID_SPLIT_SIGNATURE,
  HYPERLIQUID_TYPED_DATA,
  hyperliquidTransaction,
  stubFetch,
  transaction,
  WALLETS,
} from '../fakes';

const evmTx = transaction([], {
  type: TransactionType.EVM,
  blockChain: 'ARBITRUM',
});
const tronTx = transaction([], {
  type: TransactionType.TRON,
  blockChain: 'TRON',
});

const params = { stepIndex: 0 };
const failed = (code: string) => failure(code, 'execute_transaction');
const sent = [
  { type: 'tx_sent', stepIndex: 0, hash: 'TXHASH', explorerUrl: null },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('executeTransaction', () => {
  it('fails with CLIENT_UNEXPECTED_BEHAVIOUR when the step has no transaction', async () => {
    const signAndSendTx = vi.fn();

    const transitions = await executeTransaction(
      execution(null),
      contextFor(fakeProvider({ signer: fakeSigner(signAndSendTx) })),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it.each([
    [
      'the swap has no wallet for the chain',
      (exec: SwapExecution) => {
        delete exec.wallets.ARBITRUM;
        return exec;
      },
      fakeProvider({ namespaces: { evm: fakeEvmNamespace() } }),
    ],
    ['the provider is not available', (exec: SwapExecution) => exec, undefined],
    [
      'the provider exposes no signers',
      (exec: SwapExecution) => exec,
      fakeProvider({ namespaces: { evm: fakeEvmNamespace() }, signer: null }),
    ],
    [
      'the provider has no namespace for the chain',
      (exec: SwapExecution) => exec,
      fakeProvider(),
    ],
  ])(
    'fails with CLIENT_UNEXPECTED_BEHAVIOUR when %s',
    async (_, setup, provider) => {
      const transitions = await executeTransaction(
        setup(execution(evmTx)),
        contextFor(provider),
        params
      );

      expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
    }
  );
});

describe('an EVM transaction', () => {
  function provider(
    evm: object = fakeEvmNamespace(),
    signer = fakeSigner(),
    supportedCaipChains?: string[]
  ) {
    return fakeProvider({ namespaces: { evm }, signer, supportedCaipChains });
  }

  it('signs with the wallet of its chain, handing the signer the chain id from meta', async () => {
    const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });
    const evm = fakeEvmNamespace();

    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(provider(evm, fakeSigner(signAndSendTx))),
      params
    );

    expect(signAndSendTx).toHaveBeenCalledWith(
      evmTx,
      '0xWALLET',
      CHAIN_IDS.ARBITRUM
    );
    expect(evm.connect).not.toHaveBeenCalled();
    expect(transitions).toEqual(sent);
  });

  it('records the sign request after the guard and right before the wallet is asked', async () => {
    const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });
    const beforeSign = vi.fn().mockResolvedValue(undefined);
    const connect = vi.fn().mockResolvedValue({ accounts: [], network: '' });
    const evm = fakeEvmNamespace({
      getChainId: vi
        .fn()
        .mockResolvedValueOnce('0x1')
        .mockResolvedValue(CHAIN_IDS.ARBITRUM),
      connect,
    });

    await executeTransaction(
      execution(evmTx),
      contextFor(provider(evm, fakeSigner(signAndSendTx))),
      { ...params, beforeSign }
    );

    expect(beforeSign).toHaveBeenCalledOnce();
    expect(beforeSign.mock.invocationCallOrder[0]).toBeGreaterThan(
      connect.mock.invocationCallOrder[0]
    );
    expect(beforeSign.mock.invocationCallOrder[0]).toBeLessThan(
      signAndSendTx.mock.invocationCallOrder[0]
    );
  });

  it('records no sign request when the step parks', async () => {
    const beforeSign = vi.fn();

    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(provider(fakeEvmNamespace({}, { connected: false }))),
      { ...params, beforeSign }
    );

    expect(transitions).toMatchObject([{ type: 'blocked' }]);
    expect(beforeSign).not.toHaveBeenCalled();
  });

  it('parks the step when the wallet is disconnected', async () => {
    const signAndSendTx = vi.fn();

    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(
        provider(
          fakeEvmNamespace({}, { connected: false }),
          fakeSigner(signAndSendTx)
        )
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({ reason: 'wallet_disconnected', walletType: 'metamask' })
    );
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it('parks the step when the wallet is connected with another account', async () => {
    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(
        provider(fakeEvmNamespace({}, { accounts: [account('0xOTHER')] }))
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({
        reason: 'wrong_account',
        walletType: 'metamask',
        requiredAddress: '0xWALLET',
      })
    );
  });

  it('matches the account regardless of case', async () => {
    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(
        provider(fakeEvmNamespace({}, { accounts: [account('0xwallet')] }))
      ),
      params
    );

    expect(transitions).toMatchObject([{ type: 'tx_sent' }]);
  });

  it('switches the wallet to the chain and signs when it is on another one', async () => {
    const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });
    const evm = fakeEvmNamespace({
      getChainId: vi
        .fn()
        .mockResolvedValueOnce('0x1')
        .mockResolvedValue(CHAIN_IDS.ARBITRUM),
    });
    const exec = execution(evmTx);
    exec.wallets.ARBITRUM = { ...WALLETS.ARBITRUM, derivationPath: "m/44'" };

    const transitions = await executeTransaction(
      exec,
      contextFor(provider(evm, fakeSigner(signAndSendTx))),
      params
    );

    expect(evm.canSwitchNetwork).toHaveBeenCalledWith({
      network: 'ARBITRUM',
      supportedChains: [BLOCKCHAINS.ARBITRUM, BLOCKCHAINS.POLYGON],
    });
    expect(evm.connect).toHaveBeenCalledWith(
      {
        chainId: CHAIN_IDS.ARBITRUM,
        chainName: 'Arbitrum One',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://rpc.arbitrum.test'],
        blockExplorerUrls: ['https://scan.arbitrum.test'],
      },
      { derivationPath: "m/44'" }
    );
    expect(signAndSendTx).toHaveBeenCalledWith(
      evmTx,
      '0xWALLET',
      CHAIN_IDS.ARBITRUM
    );
    expect(transitions).toEqual(sent);
  });

  it('compares chain ids by value, whatever their notation', async () => {
    const evm = fakeEvmNamespace({
      getChainId: vi.fn().mockResolvedValue('0x0A4B1'),
    });

    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(provider(evm)),
      params
    );

    expect(evm.connect).not.toHaveBeenCalled();
    expect(transitions).toMatchObject([{ type: 'tx_sent' }]);
  });

  it('offers the switch check only the EVM chains the provider supports', async () => {
    const evm = fakeEvmNamespace({
      getChainId: vi.fn().mockResolvedValue('0x1'),
      canSwitchNetwork: vi.fn().mockReturnValue(false),
    });

    await executeTransaction(
      execution(evmTx),
      contextFor(provider(evm, fakeSigner(), ['eip155:42161'])),
      params
    );

    expect(evm.canSwitchNetwork).toHaveBeenCalledWith({
      network: 'ARBITRUM',
      supportedChains: [BLOCKCHAINS.ARBITRUM],
    });
  });

  const wrongNetwork = (switchStatus: null | 'failed') => ({
    reason: 'wrong_network',
    walletType: 'metamask',
    namespace: 'EVM',
    network: 'ARBITRUM',
    switch: switchStatus,
  });

  type EvmLike = { connect: unknown; state: () => unknown };

  it.each<[string, EvmLike]>([
    [
      'the wallet says it cannot switch',
      fakeEvmNamespace({
        getChainId: vi.fn().mockResolvedValue('0x1'),
        canSwitchNetwork: vi.fn().mockReturnValue(false),
      }),
    ],
    [
      'the namespace has no switch action',
      fakeNamespace({
        getChainId: vi.fn().mockResolvedValue('0x1'),
        connect: vi.fn(),
      }),
    ],
  ])('parks the step for a manual switch when %s', async (_, evm) => {
    const signAndSendTx = vi.fn();

    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(provider(evm, fakeSigner(signAndSendTx))),
      params
    );

    expect(transitions).toEqual(blocked(wrongNetwork(null)));
    expect(evm.connect).not.toHaveBeenCalled();
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it('parks the step as switch failed when the wallet refuses to switch', async () => {
    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(
        provider(
          fakeEvmNamespace({
            getChainId: vi.fn().mockResolvedValue('0x1'),
            connect: vi.fn().mockRejectedValue(new Error('User rejected')),
          })
        )
      ),
      params
    );

    expect(transitions).toEqual(blocked(wrongNetwork('failed')));
  });

  it('parks the step as switch failed when the wallet stays where it was', async () => {
    const signAndSendTx = vi.fn();
    const evm = fakeEvmNamespace({
      getChainId: vi.fn().mockResolvedValue('0x1'),
    });

    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(provider(evm, fakeSigner(signAndSendTx))),
      params
    );

    expect(evm.connect).toHaveBeenCalledOnce();
    expect(transitions).toEqual(blocked(wrongNetwork('failed')));
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it('fails with CLIENT_UNEXPECTED_BEHAVIOUR when meta does not know the chain', async () => {
    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(provider(), { blockchains: [BLOCKCHAINS.TRON] }),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it('fails with the signer code when the wallet rejects', async () => {
    const signAndSendTx = vi
      .fn()
      .mockRejectedValue(new SignerError(SignerErrorCode.REJECTED_BY_USER));

    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(provider(fakeEvmNamespace(), fakeSigner(signAndSendTx))),
      params
    );

    expect(transitions).toMatchObject(failed('REJECTED_BY_USER'));
  });

  it('fails with CALL_OR_SEND_FAILED when the wallet throws anything else', async () => {
    const signAndSendTx = vi.fn().mockRejectedValue(new Error('boom'));

    const transitions = await executeTransaction(
      execution(evmTx),
      contextFor(provider(fakeEvmNamespace(), fakeSigner(signAndSendTx))),
      params
    );

    expect(transitions).toMatchObject([
      { ...failed('CALL_OR_SEND_FAILED')[0], failure: { message: 'boom' } },
    ]);
  });
});

describe('a step that was parked', () => {
  const parked = () =>
    execution(evmTx, [], {
      blocked: { reason: 'wallet_disconnected', walletType: 'metamask' },
    });

  it('gets through the guard and leaves unparking to the engine hook', async () => {
    const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });
    const beforeSign = vi.fn().mockResolvedValue(undefined);

    const transitions = await executeTransaction(
      parked(),
      contextFor(
        fakeProvider({
          namespaces: { evm: fakeEvmNamespace() },
          signer: fakeSigner(signAndSendTx),
        })
      ),
      { ...params, beforeSign }
    );

    expect(beforeSign).toHaveBeenCalledOnce();
    expect(transitions).toEqual(sent);
  });

  it('stays parked under the reason that now applies', async () => {
    const transitions = await executeTransaction(
      parked(),
      contextFor(
        fakeProvider({
          namespaces: {
            evm: fakeEvmNamespace({}, { accounts: [account('0xOTHER')] }),
          },
        })
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({
        reason: 'wrong_account',
        walletType: 'metamask',
        requiredAddress: '0xWALLET',
      })
    );
  });
});

describe('a transaction of any other type', () => {
  function provider(tron: object = fakeNamespace({}), signer = fakeSigner()) {
    return fakeProvider({ namespaces: { tron }, signer });
  }

  it('signs with the namespace of its type, handing the signer the chain id from meta', async () => {
    const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });

    const transitions = await executeTransaction(
      execution(tronTx),
      contextFor(provider(fakeNamespace({}), fakeSigner(signAndSendTx))),
      params
    );

    expect(signAndSendTx).toHaveBeenCalledWith(
      tronTx,
      '0xTRONWALLET',
      CHAIN_IDS.TRON
    );
    expect(transitions).toEqual(sent);
  });

  it('hands the signer a null chain id when meta has none for the chain', async () => {
    const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });

    await executeTransaction(
      execution(tronTx),
      contextFor(provider(fakeNamespace({}), fakeSigner(signAndSendTx)), {
        blockchains: [],
      }),
      params
    );

    expect(signAndSendTx).toHaveBeenCalledWith(tronTx, '0xTRONWALLET', null);
  });

  it('parks the step when the wallet is disconnected', async () => {
    const signAndSendTx = vi.fn();

    const transitions = await executeTransaction(
      execution(tronTx),
      contextFor(
        provider(
          fakeNamespace({}, { connected: false }),
          fakeSigner(signAndSendTx)
        )
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({ reason: 'wallet_disconnected', walletType: 'tronlink' })
    );
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it('parks the step when the wallet is connected with another account', async () => {
    const transitions = await executeTransaction(
      execution(tronTx),
      contextFor(
        provider(fakeNamespace({}, { accounts: [account('TOTHER', 'tron:0')] }))
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({
        reason: 'wrong_account',
        walletType: 'tronlink',
        requiredAddress: '0xTRONWALLET',
      })
    );
  });

  it('fails with CLIENT_UNEXPECTED_BEHAVIOUR for a type no namespace signs', async () => {
    const cosmosTx = transaction([], {
      type: TransactionType.COSMOS,
      blockChain: 'COSMOS',
    });
    const exec = execution(cosmosTx);
    exec.wallets.COSMOS = { walletType: 'keplr', address: 'cosmos1' };

    const transitions = await executeTransaction(
      exec,
      contextFor(fakeProvider({ namespaces: { cosmos: fakeNamespace({}) } })),
      params
    );

    expect(transitions).toMatchObject([
      {
        ...failed('CLIENT_UNEXPECTED_BEHAVIOUR')[0],
        failure: { message: 'COSMOS transactions are not supported' },
      },
    ]);
  });
});

describe('a Hyperliquid transaction', () => {
  const tx = hyperliquidTransaction();
  const submitted = [{ type: 'tx_submitted', stepIndex: 0 }];

  function provider(
    evm: object = fakeEvmNamespace(),
    signTypedData = vi.fn().mockResolvedValue(HYPERLIQUID_SIGNATURE)
  ) {
    return fakeProvider({
      namespaces: { evm },
      signer: fakeSigner(vi.fn(), signTypedData),
    });
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('signs the typed data on the signature chain, submits it, and reports the action as submitted', async () => {
    const fetchMock = stubFetch({ status: 'ok' });
    const signTypedData = vi.fn().mockResolvedValue(HYPERLIQUID_SIGNATURE);
    const beforeSign = vi.fn().mockResolvedValue(undefined);

    const transitions = await executeTransaction(
      execution(tx),
      contextFor(provider(fakeEvmNamespace(), signTypedData)),
      { ...params, beforeSign }
    );

    const { domain, primaryType, types, message } = HYPERLIQUID_TYPED_DATA;
    expect(signTypedData).toHaveBeenCalledWith(
      { domain, types: { [primaryType]: types[primaryType] }, value: message },
      '0xWALLET',
      CHAIN_IDS.ARBITRUM
    );
    expect(beforeSign.mock.invocationCallOrder[0]).toBeLessThan(
      signTypedData.mock.invocationCallOrder[0]
    );
    expect(fetchMock).toHaveBeenCalledWith(
      HYPERLIQUID_EXCHANGE_API_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          action: tx.action,
          signature: HYPERLIQUID_SPLIT_SIGNATURE,
          nonce: tx.nonce,
        }),
      })
    );
    expect(transitions).toEqual(submitted);
  });

  it('switches the wallet to the signature chain rather than to Hyperliquid', async () => {
    stubFetch({ status: 'ok' });
    const connect = vi.fn().mockResolvedValue({ accounts: [], network: '' });
    const evm = fakeEvmNamespace({
      getChainId: vi
        .fn()
        .mockResolvedValueOnce('0x1')
        .mockResolvedValue(CHAIN_IDS.ARBITRUM),
      connect,
    });

    const transitions = await executeTransaction(
      execution(tx),
      contextFor(provider(evm)),
      params
    );

    expect(connect).toHaveBeenCalledWith(
      expect.objectContaining({ chainId: CHAIN_IDS.ARBITRUM }),
      expect.anything()
    );
    expect(transitions).toEqual(submitted);
  });

  it('parks the step naming the signature chain when the wallet cannot switch', async () => {
    const evm = fakeEvmNamespace({
      getChainId: vi.fn().mockResolvedValue('0x1'),
      canSwitchNetwork: vi.fn().mockReturnValue(false),
    });

    const transitions = await executeTransaction(
      execution(tx),
      contextFor(provider(evm)),
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
  });

  it('fails when the signer cannot sign typed data', async () => {
    const transitions = await executeTransaction(
      execution(tx),
      contextFor(
        fakeProvider({
          namespaces: { evm: fakeEvmNamespace() },
          signer: fakeSigner(vi.fn()),
        })
      ),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it('fails with the signer code when the wallet rejects', async () => {
    const signTypedData = vi
      .fn()
      .mockRejectedValue(new SignerError(SignerErrorCode.REJECTED_BY_USER));

    const transitions = await executeTransaction(
      execution(tx),
      contextFor(provider(fakeEvmNamespace(), signTypedData)),
      params
    );

    expect(transitions).toMatchObject(failed('REJECTED_BY_USER'));
  });

  it('fails with SEND_TX_FAILED when the exchange rejects the action', async () => {
    stubFetch({ status: 'err', response: 'Invalid nonce' });

    const transitions = await executeTransaction(
      execution(tx),
      contextFor(provider()),
      params
    );

    expect(transitions).toMatchObject([
      {
        ...failed('SEND_TX_FAILED')[0],
        failure: { message: expect.stringContaining('Invalid nonce') },
      },
    ]);
  });

  it('fails with SEND_TX_FAILED when the exchange cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const transitions = await executeTransaction(
      execution(tx),
      contextFor(provider()),
      params
    );

    expect(transitions).toMatchObject(failed('SEND_TX_FAILED'));
  });

  it('fails when meta has no EVM chain with the signature chain id', async () => {
    const transitions = await executeTransaction(
      execution(tx),
      contextFor(provider(), { blockchains: [BLOCKCHAINS.HYPERLIQUID] }),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it.each([
    [
      'the action is of a kind the SDK does not sign',
      hyperliquidTransaction({
        action: { ...tx.action, type: 'spot' as 'withdraw3' },
      }),
    ],
    ['the message is empty', hyperliquidTransaction({ message: '' })],
    ['the message is not JSON', hyperliquidTransaction({ message: '{' })],
    [
      'the message is not typed data',
      hyperliquidTransaction({ message: '{"domain":{}}' }),
    ],
  ])('fails without asking the wallet when %s', async (_, badTx) => {
    const signTypedData = vi.fn();

    const transitions = await executeTransaction(
      execution(badTx),
      contextFor(provider(fakeEvmNamespace(), signTypedData)),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
    expect(signTypedData).not.toHaveBeenCalled();
  });
});
