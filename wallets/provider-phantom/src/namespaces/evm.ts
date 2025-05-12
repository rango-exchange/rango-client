import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/evm';

import { EVM_SUPPORTED_CHAINS, WALLET_ID } from '../constants.js';
import { evmPhantom } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(evmPhantom);

/*
 * TODO: If user imported a private key for EVM, it hasn't solana.
 * when trying to connect to solana for this user we go through `-32603` which is an internal error.
 * If phantom added an specific error code for this situation, we can consider handling the error here.
 * @see https://docs.phantom.app/solana/errors
 */
const connect = builders
  .connect()
  .action(actions.connect(evmPhantom))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmPhantom))
  .build();
const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork(EVM_SUPPORTED_CHAINS))
  .build();
const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .action(canSwitchNetwork)
  .build();

export { evm };
