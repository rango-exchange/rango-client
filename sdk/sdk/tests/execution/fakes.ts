import type { ConfirmedRoute } from '../../src/confirmation/types';
import type { ActionContext, SdkMeta } from '../../src/execution/context';
import type { FailurePhase } from '../../src/execution/transitions';
import type {
  SwapExecution,
  SwapExecutionStep,
} from '../../src/execution/types';
import type { Provider } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { HyperliquidTransaction, Transaction } from 'rango-sdk';
import type {
  BlockchainMeta,
  GenericSigner,
  SignerFactory,
  TransactionPrerequisite,
  TransactionPrerequisiteResult,
} from 'rango-types';

import { TransactionType } from 'rango-types';
import { type Mock, vi } from 'vitest';

import { createExecution } from '../../src/execution/create';

/** The wallets every fake execution carries, keyed by chain. */
export const WALLETS = {
  XRPL: { walletType: 'gem', address: 'rWALLET' },
  STELLAR: { walletType: 'freighter', address: 'GWALLET' },
  ARBITRUM: { walletType: 'metamask', address: '0xWALLET' },
  // The same EVM wallet: Hyperliquid actions are signed by it, on Arbitrum.
  HYPERLIQUID: { walletType: 'metamask', address: '0xWALLET' },
  TRON: { walletType: 'tronlink', address: '0xTRONWALLET' },
};

/** The chain ids meta reports, as the signers and the EVM guard see them. */
export const CHAIN_IDS = {
  ARBITRUM: '0xa4b1',
  POLYGON: '0x89',
  TRON: '0x2b6653dc',
  XRPL: 'xrpl-mainnet',
  STELLAR: 'stellar-pubnet',
};

function evmBlockchain(name: string, chainId: string, chainName: string) {
  return {
    name,
    type: TransactionType.EVM,
    chainId,
    info: {
      infoType: 'EvmMetaInfo',
      chainName,
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: [`https://rpc.${name.toLowerCase()}.test`],
      blockExplorerUrls: [`https://scan.${name.toLowerCase()}.test`],
      enableGasV2: true,
    },
  } as unknown as BlockchainMeta;
}

/** Only the fields the actions read from meta; the cast covers the rest. */
export const BLOCKCHAINS = {
  ARBITRUM: evmBlockchain('ARBITRUM', CHAIN_IDS.ARBITRUM, 'Arbitrum One'),
  POLYGON: evmBlockchain('POLYGON', CHAIN_IDS.POLYGON, 'Polygon'),
  TRON: {
    name: 'TRON',
    type: TransactionType.TRON,
    chainId: CHAIN_IDS.TRON,
  } as unknown as BlockchainMeta,
  XRPL: {
    name: 'XRPL',
    type: TransactionType.XRPL,
    chainId: CHAIN_IDS.XRPL,
  } as unknown as BlockchainMeta,
  STELLAR: {
    name: 'STELLAR',
    type: TransactionType.STELLAR,
    chainId: CHAIN_IDS.STELLAR,
  } as unknown as BlockchainMeta,
  HYPERLIQUID: {
    name: 'HYPERLIQUID',
    type: TransactionType.HYPERLIQUID,
    chainId: '1337',
  } as unknown as BlockchainMeta,
};

export const META: SdkMeta = { blockchains: Object.values(BLOCKCHAINS) };

function route(): ConfirmedRoute {
  return {
    requestId: 'req-1',
    result: { outputAmount: '2', resultType: 'OK', swaps: [{}] },
  } as unknown as ConfirmedRoute;
}

/** Only the fields the actions read; the cast covers the rest. */
export function transaction(
  prerequisites: TransactionPrerequisite[] = [],
  fields: Partial<Transaction> = {}
): Transaction {
  return { prerequisites, ...fields } as Transaction;
}

/** An execution whose first step holds the given transaction and state. */
export function execution(
  tx: Transaction | null,
  prerequisiteResults: TransactionPrerequisiteResult[] = [],
  step: Partial<SwapExecutionStep> = {}
): SwapExecution {
  const exec = createExecution({
    route: route(),
    wallets: { ...WALLETS },
    settings: { slippage: '1' },
    validateBalanceOrFee: true,
  });
  exec.steps[0] = { ...exec.steps[0], tx, prerequisiteResults, ...step };
  return exec;
}

/** A signer with the given `signAndSendTx`, and `signTypedData` only when one is given. */
export function fakeSigner(
  signAndSendTx: GenericSigner<Transaction>['signAndSendTx'] = vi
    .fn()
    .mockResolvedValue({ hash: 'HASH' }),
  signTypedData?: GenericSigner<Transaction>['signTypedData']
): GenericSigner<Transaction> {
  return {
    signAndSendTx,
    signMessage: vi.fn(),
    ...(signTypedData && { signTypedData }),
  };
}

/** A CAIP-10 account for an address; the guards only read the address segment. */
export function account(address: string, chain = 'eip155:42161'): string {
  return `${chain}:${address}`;
}

export type FakeNamespaceState = {
  connected?: boolean;
  accounts?: string[] | null;
  network?: string | null;
};

type NamespaceData = {
  connected: boolean;
  connecting: boolean;
  accounts: string[] | null;
  network: string | null;
  connectArgs: Record<string, unknown> | null;
};

type SetNamespaceData = <K extends keyof NamespaceData>(
  key: K,
  value: NamespaceData[K]
) => void;

/**
 * A hub namespace exposing the given actions, with the state the guards
 * read. It is connected with every fake wallet unless told otherwise; a test
 * changes it later through the setter `state()` returns, as hub does.
 */
export function fakeNamespace<T extends object>(
  actions: T,
  state: FakeNamespaceState = {}
): T & { state: () => [() => NamespaceData, SetNamespaceData] } {
  const data: NamespaceData = {
    connected: true,
    connecting: false,
    accounts: Object.values(WALLETS).map((wallet) => account(wallet.address)),
    network: null,
    connectArgs: null,
    ...state,
  };
  const setData: SetNamespaceData = (key, value) => {
    data[key] = value;
  };
  return { ...actions, state: () => [() => data, setData] };
}

export type FakeEvmActions = Partial<{
  getChainId: unknown;
  canSwitchNetwork: unknown;
  connect: unknown;
  getAllowance: unknown;
  getTransactionReceipt: unknown;
}>;

/** An EVM namespace on Arbitrum that can switch chains; a test overrides what it needs. */
export function fakeEvmNamespace(
  actions: FakeEvmActions = {},
  state: FakeNamespaceState = {}
) {
  return fakeNamespace(
    {
      getChainId: vi.fn().mockResolvedValue(CHAIN_IDS.ARBITRUM),
      canSwitchNetwork: vi.fn().mockReturnValue(true),
      connect: vi.fn().mockResolvedValue({
        accounts: [account(WALLETS.ARBITRUM.address)],
        network: CHAIN_IDS.ARBITRUM,
      }),
      ...actions,
    },
    state
  );
}

export type FakeProviderOptions = {
  /** The namespaces the provider registered, keyed by namespace key. One without `state` is wrapped as connected. */
  namespaces?: Record<string, object>;
  /** `null` for a provider that exposes no signers property. */
  signer?: GenericSigner<Transaction> | null;
  /** When set, the provider declares an EVM namespace supporting exactly these CAIP-2 chains. */
  supportedCaipChains?: string[];
};

/** A hub provider exposing only what the actions touch. */
export function fakeProvider(
  options: FakeProviderOptions = {}
): Provider<DefaultNamespaces> {
  const {
    namespaces = {},
    signer = fakeSigner(),
    supportedCaipChains,
  } = options;
  const factory = { getSigner: () => signer } as unknown as SignerFactory;

  const registered = Object.fromEntries(
    Object.entries(namespaces).map(([key, namespace]) => [
      key,
      'state' in namespace ? namespace : fakeNamespace(namespace),
    ])
  );

  const properties: object[] = [];
  if (signer) {
    properties.push({
      name: 'signers',
      value: { getSigners: async () => factory },
    });
  }
  if (supportedCaipChains) {
    properties.push({
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'EVM',
            id: 'EVM',
            value: 'evm',
            isChainSupported: (chainId: string) =>
              supportedCaipChains.includes(chainId),
          },
        ],
      },
    });
  }

  const provider = {
    id: 'fake',
    get: (id: string) => registered[id],
    info: () => ({
      metadata: { name: 'Fake', icon: '', extensions: {}, properties },
    }),
  };
  return provider as unknown as Provider<DefaultNamespaces>;
}

/** The context the actions get, around one provider and the fake meta. */
export function contextFor(
  provider: Provider<DefaultNamespaces> | undefined,
  meta: SdkMeta = META
): ActionContext {
  return { getProvider: () => provider, getMeta: () => meta };
}

/** The shape of a `failed` transition list, for `toMatchObject`. */
export function failure(code: string, phase: FailurePhase) {
  return [{ type: 'failed', failure: { code, phase, stepIndex: 0 } }];
}

/** The shape of a `blocked` transition list, for `toEqual`. */
export function blocked(block: object) {
  return [{ type: 'blocked', stepIndex: 0, block }];
}

/** The EIP-712 payload the API hands over as `message`, as JSON. */
export const HYPERLIQUID_TYPED_DATA = {
  domain: {
    name: 'HyperliquidSignTransaction',
    version: '1',
    chainId: 42161,
    verifyingContract: '0x0000000000000000000000000000000000000000',
  },
  primaryType: 'HyperliquidTransaction:Withdraw',
  types: {
    EIP712Domain: [{ name: 'name', type: 'string' }],
    'HyperliquidTransaction:Withdraw': [
      { name: 'destination', type: 'string' },
    ],
  } as Record<string, unknown>,
  message: {
    hyperliquidChain: 'Mainnet',
    destination: WALLETS.HYPERLIQUID.address,
    amount: '10',
    time: 1700,
  },
};

/** Bytes in each of r and s. */
const SIGNATURE_WORD_BYTES = 32;
const R_HEX = 'ab'.repeat(SIGNATURE_WORD_BYTES);
const S_HEX = 'cd'.repeat(SIGNATURE_WORD_BYTES);

/** A 65-byte signature with v = 27, as a wallet returns it. */
export const HYPERLIQUID_SIGNATURE = `0x${R_HEX}${S_HEX}1b`;

/** What the SDK splits `HYPERLIQUID_SIGNATURE` into for the exchange. */
export const HYPERLIQUID_SPLIT_SIGNATURE = {
  r: `0x${R_HEX}`,
  s: `0x${S_HEX}`,
  v: 27,
};

/** A withdraw action signed on Arbitrum, with the fields the executor reads. */
export function hyperliquidTransaction(
  fields: Partial<HyperliquidTransaction> = {}
): HyperliquidTransaction {
  return {
    type: TransactionType.HYPERLIQUID,
    blockChain: 'HYPERLIQUID',
    prerequisites: [],
    action: {
      type: 'withdraw3',
      signatureChainId: CHAIN_IDS.ARBITRUM,
      hyperliquidChain: 'Mainnet',
      destination: WALLETS.HYPERLIQUID.address,
      amount: '10',
      time: 1700,
    },
    message: JSON.stringify(HYPERLIQUID_TYPED_DATA),
    nonce: 1700,
    expectedOutput: '10',
    ...fields,
  };
}

/**
 * Stubs `fetch` with one JSON body per call, in order, and returns the mock
 * to assert on. Tests undo it with `vi.unstubAllGlobals()`.
 */
export function stubFetch(...bodies: unknown[]): Mock {
  const fetchMock = vi.fn();
  bodies.forEach((body) => {
    fetchMock.mockResolvedValueOnce({ json: async () => body });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
