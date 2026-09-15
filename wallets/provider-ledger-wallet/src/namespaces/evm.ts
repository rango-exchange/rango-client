import type { Context } from '@hub3js/core';
import type { Chain, ChainId, EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders, utils } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { getProvider } from '../ledgerProvider.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(getProvider)
  /*
   * The Ledger Button returns the connected accounts with the active one first.
   * Since we only need the active account, we take the first element.
   */
  .format(async (instance, accounts) => {
    const chainId = await instance.request({ method: 'eth_chainId' });
    return utils.formatAccountsToCAIP([accounts[0]], chainId);
  })
  .build();

/*
 *  The Ledger provider rejects every method except `eth_requestAccounts` with
 *  "Unauthorized" until it is connected, so we must request accounts FIRST to
 *   establish the session, and only then switch chain / read the chain id.
 */
const connect = builders
  .connect()
  .action(async (_context: Context<EvmActions>, chain?: Chain | ChainId) => {
    const provider = getProvider();

    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    if (chain) {
      await utils.switchOrAddNetwork(provider, chain);
    }

    const chainId = await provider.request({
      method: 'eth_chainId',
    });

    /*
     * The Ledger provider returns the connected accounts with the active one
     * first, so we take the first element as the active account.
     */
    return {
      accounts: utils.formatAccountsToCAIP([accounts[0]], chainId),
      network: chainId,
    };
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  /*
   * Tell the Ledger provider to clear its cached account/chain (see
   * `LedgerEIP1193Provider.disconnect`) so a later reconnect starts clean.
   * It must never make our own disconnect flow fail, hence the guard.
   */
  .before(async () => {
    try {
      /*
       * hub3 types `disconnect` as `() => void`, but the Ledger provider's
       * implementation is async, so cast to await the real promise (and let
       * the catch handle a rejection).
       */
      await (getProvider().disconnect() as unknown as Promise<void>);
    } catch (error) {
      console.error('[ledger-wallet] provider.disconnect failed', error);
    }
  })
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(() => {
    return actions.canEagerConnect(getProvider);
  })
  .build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork())
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(getProvider))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .action(canSwitchNetwork)
  .action(getChainId)
  .build();

export { evm };
