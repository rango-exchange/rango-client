import type { Context } from '@hub3js/core';
import type { Chain, ChainId, EvmActions, EvmRpcUrls } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import {
  actions,
  builders,
  utils,
  viemPublicAdapter,
  viemWalletAdapter,
} from '@hub3js/evm';
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

const getAllowance = builders
  .getAllowance()
  .action(actions.getAllowance(getProvider))
  .build();

/*
 * viem's public actions that only use the reads the Ledger provider forwards
 * to its node: `eth_blockNumber`, `eth_getBalance`, `eth_getCode`,
 * `eth_estimateGas` and `eth_call`. It rejects every other read, e.g.
 * `eth_getTransactionReceipt`, with 4200 (unsupported method).
 *
 * Ledger's list (`BROADCASTED_TO_NODE_RPC_METHODS`), as of the latest release
 * (`@ledgerhq/ledger-wallet-provider` 2.0.2):
 * https://github.com/LedgerHQ/ledger-button-public/blob/cc33f953aa/packages/ledger-wallet-provider-evm/src/utils/supportedRpcMethods.ts
 * `eth_getTransactionReceipt` is added on their develop branch, so the receipt
 * actions can move here once it's released.
 */
const LEDGER_PUBLIC_ACTIONS: ReadonlyArray<keyof EvmActions> = [
  'getBalance',
  'getBlockNumber',
  'getCode',
  'getBytecode',
  'estimateGas',
  'estimateContractGas',
  'call',
  'readContract',
  'simulateContract',
];

const buildEvm = (rpcUrls?: EvmRpcUrls) => {
  const publicActions = viemPublicAdapter(rpcUrls);
  const publicActionNames = new Set(publicActions.map(([name]) => name));

  return (
    new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
      // Every public action from our RPC, for the reads Ledger doesn't serve.
      .action(publicActions)
      /*
       * Wallet actions, and the reads Ledger serves, come from the wallet (on
       * the chain it's on). Its other reads are left to the actions above.
       */
      .action(
        viemWalletAdapter(getProvider).filter(
          ([name]) =>
            !publicActionNames.has(name) || LEDGER_PUBLIC_ACTIONS.includes(name)
        )
      )
      .action(connect)
      .action(disconnect)
      .action(canEagerConnect)
      .action(canSwitchNetwork)
      .action(getChainId)
      .action(getAllowance)
      .build()
  );
};

export { buildEvm };
