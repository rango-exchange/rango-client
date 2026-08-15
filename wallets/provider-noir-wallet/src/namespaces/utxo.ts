import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import {
  builders,
  CAIP_ZCASH_CHAIN_ID,
  utils,
} from '@rango-dev/wallets-core/namespaces/utxo';

import { changeAccountSubscriberBuilder } from '../builders/utxo.js';
import { WALLET_ID } from '../constants.js';
import { getInstanceOrThrow } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  changeAccountSubscriberBuilder().build();

const connect = builders
  .connect()
  .action(async function () {
    const noirWallet = getInstanceOrThrow();
    const zcash = noirWallet.zcash;

    // Check existing connection (silent, no popup)
    const accounts = await zcash.getAccounts();

    // Connect wallet if not connected (shows popup)
    if (!accounts) {
      const newAccounts = await zcash.connect();
      return utils.formatAccountsToCAIP(
        [newAccounts.transparent],
        CAIP_ZCASH_CHAIN_ID
      );
    }
    return utils.formatAccountsToCAIP(
      [accounts.transparent],
      CAIP_ZCASH_CHAIN_ID
    );
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = new ActionBuilder<UtxoActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(async () => {
    try {
      const noirWallet = getInstanceOrThrow();
      const zcash = noirWallet.zcash;

      // Check existing connection (silent, no popup)
      const accounts = await zcash.getAccounts();

      return !!accounts;
    } catch {
      return false;
    }
  })
  .build();

const disconnect = commonBuilders
  .disconnect<UtxoActions>()
  .before(() => {
    try {
      const noirWallet = getInstanceOrThrow();
      const zcash = noirWallet.zcash;
      void zcash.disconnect();
    } catch {
      // Ignore errors during disconnect
    }
  })
  .after(changeAccountCleanup)
  .build();

export const namespace = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();
