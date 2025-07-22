import type { EvmActions } from '@arlert-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@arlert-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@arlert-dev/wallets-core/namespaces/common';
import { actions, builders } from '@arlert-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import {
  evmTrustWallet,
  standardizeTrustWalletInAppBrowserError,
} from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(evmTrustWallet);

const connect = builders
  .connect()
  .action(actions.connect(evmTrustWallet))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeTrustWalletInAppBrowserError)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { evm };
