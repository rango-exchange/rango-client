import type { SolanaActions } from '@arlert-dev/wallets-core/namespaces/solana';

import { NamespaceBuilder } from '@arlert-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@arlert-dev/wallets-core/namespaces/common';
import { actions, builders } from '@arlert-dev/wallets-core/namespaces/solana';

import { WALLET_ID } from '../constants.js';
import {
  solanaTrustWallet,
  standardizeTrustWalletInAppBrowserError,
} from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(solanaTrustWallet);

const connect = builders
  .connect()
  .action(actions.connect(solanaTrustWallet))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeTrustWalletInAppBrowserError)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .after(changeAccountCleanup)
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { solana };
