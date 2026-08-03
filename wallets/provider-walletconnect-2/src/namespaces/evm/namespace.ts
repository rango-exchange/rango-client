import type { Context } from '@hub3js/core';
import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders, utils } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { getAdapter } from '../../adapter/registry.js';
import { WALLET_ID } from '../../constants.js';
import { getAccountsFromSession } from '../../session/accounts.js';
import { filterEvmAccounts } from '../../session/evm.js';
import { chainReferenceToHex, parseChainReference } from '../../utils.js';

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
  .action(async function (_context: Context<EvmActions>, chain?: string) {
    const adapter = getAdapter();
    // `chain` is set when connecting to a specific network (swap auto-switch or hub connect with network).
    const requestedReference = chain ? parseChainReference(chain) : undefined;
    const session = await adapter.ensureConnectedToChain(chain);
    const activeReference =
      requestedReference ?? (await adapter.resolveActiveChainReference());

    if (!activeReference) {
      throw new Error(
        'Unable to determine EVM chain id from WalletConnect session.'
      );
    }

    const accounts = getAccountsFromSession(session);
    const evmAccounts = filterEvmAccounts(accounts, activeReference);

    if (!evmAccounts.length) {
      throw new Error('No EVM accounts found in WalletConnect session.');
    }

    return {
      accounts: utils.formatAccountsToCAIP(
        evmAccounts.map((account) => account.accounts[0]),
        activeReference
      ),
      network: chainReferenceToHex(activeReference),
    };
  })
  .before(sessionUpdate)
  .before(sessionEvent)
  .before(sessionDelete)
  .or(sessionUpdateCleanup)
  .or(sessionEventCleanup)
  .or(sessionDeleteCleanup)
  .or((_, err) => {
    void getAdapter().disconnectSession('evm');
    return err;
  })
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(async () => getAdapter().tryRestoreEagerSession('evm'))
  .build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork())
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .before(async () => {
    await getAdapter().disconnectSession('evm');
  })
  .after(sessionUpdateCleanup)
  .after(sessionEventCleanup)
  .after(sessionDeleteCleanup)
  .build();

const getChainId = builders
  .getChainId()
  .action(async () => getAdapter().getCurrentChainId())
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(canEagerConnect)
  .action(canSwitchNetwork)
  .action(disconnect)
  .action(getChainId)
  .build();

export { evm };
