import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import {
  builders,
  CAIP_BITCOIN_CHAIN_ID,
  utils,
  type UtxoActions,
} from '@rango-dev/wallets-core/namespaces/utxo';

import { getAdapter } from '../../adapter/registry.js';
import { WALLET_ID } from '../../constants.js';
import { filterBip122Accounts } from '../../session/bip122.js';

import {
  sessionDeleteSubscriber,
  sessionEventSubscriber,
  sessionUpdateSubscriber,
} from './hooks.js';

const [sessionUpdate, sessionUpdateCleanup] = sessionUpdateSubscriber();
const [sessionEvent, sessionEventCleanup] = sessionEventSubscriber();
const [sessionDelete, sessionDeleteCleanup] = sessionDeleteSubscriber();

const connect = builders
  .connect()
  .action(async function () {
    const adapter = getAdapter();
    const session = await adapter.ensureSession({ namespace: 'utxo' });
    const bip122Accounts = filterBip122Accounts(session);

    if (!bip122Accounts.length) {
      throw new Error('No Bitcoin accounts found in WalletConnect session.');
    }

    return utils.formatAccountsToCAIP(
      [bip122Accounts[0].address],
      CAIP_BITCOIN_CHAIN_ID
    );
  })
  .before(sessionUpdate)
  .before(sessionEvent)
  .before(sessionDelete)
  .or(sessionUpdateCleanup)
  .or(sessionEventCleanup)
  .or(sessionDeleteCleanup)
  .or((_, err) => {
    void getAdapter().disconnectSession('utxo');
    return err;
  })
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = new ActionBuilder<UtxoActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(async () => getAdapter().tryRestoreEagerSession('utxo'))
  .build();

const disconnect = commonBuilders
  .disconnect<UtxoActions>()
  .before(async () => {
    await getAdapter().disconnectSession('utxo');
  })
  .after(sessionUpdateCleanup)
  .after(sessionEventCleanup)
  .after(sessionDeleteCleanup)
  .build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { utxo };
