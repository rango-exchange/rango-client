import type { SolanaActions } from '@hub3js/solana';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders, hooks } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import {
  solanaTrustWallet,
  standardizeTrustWalletInAppBrowserError,
} from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(solanaTrustWallet);

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
