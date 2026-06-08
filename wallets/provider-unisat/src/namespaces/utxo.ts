import type { CaipAccount } from '@hub3js/std/types';
import type {
  ProviderAPI,
  UtxoActions,
} from '@rango-dev/wallets-core/namespaces/utxo';

import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { ChangeAccountSubscriberBuilder } from '@hub3js/std/hooks';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import {
  builders,
  CAIP_BITCOIN_CHAIN_ID,
  CAIP_NAMESPACE,
  utils,
} from '@rango-dev/wallets-core/namespaces/utxo';
import {
  Networks,
  type ProviderConnectResult,
} from '@rango-dev/wallets-shared';
import { AccountId } from 'caip';

import { WALLET_ID } from '../constants.js';
import { bitcoinUnisat } from '../utils.js';

const getBitcoinAccounts: () => Promise<ProviderConnectResult> = async () => {
  const instance = bitcoinUnisat();
  const accounts = await instance.requestAccounts();

  return {
    accounts: accounts,
    chainId: Networks.BTC,
  };
};

const [changeAccountSubscriber, changeAccountCleanup] =
  new ChangeAccountSubscriberBuilder<string[], ProviderAPI, UtxoActions>()
    .getInstance(bitcoinUnisat)
    .onSwitchAccount((event, context) => {
      if (!event.payload.length) {
        event.preventDefault();
        context.action('disconnect');
      }
    })
    .format(async (_, accounts) => {
      return utils.formatAccountsToCAIP(accounts, CAIP_BITCOIN_CHAIN_ID);
    })
    .addEventListener((instance, callback) => {
      return instance.on('accountsChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      return instance.removeListener('accountsChanged', callback);
    })
    .build();

const connect = builders
  .connect()
  .action(async function () {
    const result = await getBitcoinAccounts();
    if (Array.isArray(result)) {
      throw new Error(
        'Expecting bitcoin response to be a single value, not an array.'
      );
    }

    const formatAccounts = result.accounts.map(
      (account) =>
        AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: CAIP_BITCOIN_CHAIN_ID,
          },
        }) as CaipAccount
    );

    return formatAccounts;
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<UtxoActions>()
  .after(changeAccountCleanup)
  .build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { utxo };
