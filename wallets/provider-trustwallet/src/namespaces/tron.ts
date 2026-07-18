import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import {
  builders,
  type TronActions,
} from '@rango-dev/wallets-core/namespaces/tron';

import { tronActions } from '../actions/tron.js';
import { tronBuilders } from '../builders/tron.js';
import { WALLET_ID } from '../constants.js';
import {
  standardizeTrustWalletInAppBrowserError,
  tronTrustWallet,
} from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = tronBuilders
  .changeAccountSubscriber(tronTrustWallet)
  .build();

const connect = builders
  .connect()
  .action(tronActions.connect())
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeTrustWalletInAppBrowserError)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<TronActions>()
  .after(changeAccountCleanup)
  .build();

const tron = new NamespaceBuilder<TronActions>('Tron', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { tron };
