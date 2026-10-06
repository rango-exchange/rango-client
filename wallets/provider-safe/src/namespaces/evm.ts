import type { Context, FunctionWithContext } from '@hub3js/core';
import type { EvmActions } from '@hub3js/evm';
import type { OffChainSignMessageResponse } from '@safe-global/safe-apps-sdk';

import { NamespaceBuilder } from '@hub3js/core';
import {
  actions,
  builders,
  hooks,
  viemPublicAdapter,
  viemWalletAdapter,
} from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { sdk } from '../safe.js';
import { resolveTransactionHash } from '../transactionHash.js';
import { evmSafe, getSafeAccounts } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(evmSafe);

const connect = builders
  .connect()
  .action(actions.connect(evmSafe, { getAccounts: getSafeAccounts }))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork())
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmSafe))
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmSafe))
  .build();

const getAllowance = builders
  .getAllowance()
  .action(actions.getAllowance(evmSafe))
  .build();

const getTransactionReceipt = builders
  .getTransactionReceipt()
  .action(actions.getTransactionReceipt(evmSafe))
  .build();

const waitForTransactionReceipt = builders
  .waitForTransactionReceipt()
  .action(actions.waitForTransactionReceipt(evmSafe))
  .build();

// Safe signs messages off-chain through its SDK.
const signMessage: FunctionWithContext<
  EvmActions['signMessage'],
  Context<EvmActions>
> = async (_context, params) => {
  const message = params?.message;
  if (typeof message !== 'string') {
    throw new Error('Safe can only sign text messages.');
  }
  const { signature } = (await sdk.txs.signMessage(
    message
  )) as OffChainSignMessageResponse & { signature: `0x${string}` };
  return signature;
};

/*
 * Safe's `sendTransaction` returns a safeTxHash. This extra action, which
 * queue-manager looks up by name, maps it to the on-chain hash.
 */
const RESOLVE_TRANSACTION_HASH = 'resolveTransactionHash' as keyof EvmActions;
const resolveTransactionHashAction = (async (
  _context: Context<EvmActions>,
  hash: string
) => resolveTransactionHash(hash)) as unknown as FunctionWithContext<
  EvmActions[keyof EvmActions],
  Context<EvmActions>
>;

const buildEvm = (rpcUrl: string) =>
  new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
    .action(connect)
    .action(disconnect)
    .action(canEagerConnect)
    .action(canSwitchNetwork)
    .action(getChainId)
    .action(getAllowance)
    .action(getTransactionReceipt)
    .action(waitForTransactionReceipt)
    .action(viemWalletAdapter(evmSafe))
    .action(viemPublicAdapter(rpcUrl))
    .action('signMessage', signMessage)
    .action(RESOLVE_TRANSACTION_HASH, resolveTransactionHashAction)
    .build();

export { buildEvm };
