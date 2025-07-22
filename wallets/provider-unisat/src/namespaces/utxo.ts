import type {
  ProviderAPI,
  UtxoActions,
} from '@arlert-dev/wallets-core/namespaces/utxo';

import {
  NamespaceBuilder,
  type Subscriber,
  type SubscriberCleanUp,
} from '@arlert-dev/wallets-core';
import {
  type CaipAccount,
  standardizeAndThrowError,
} from '@arlert-dev/wallets-core/namespaces/common';
import { builders as commonBuilders } from '@arlert-dev/wallets-core/namespaces/common';
import {
  builders,
  CAIP_BITCOIN_CHAIN_ID,
  CAIP_NAMESPACE,
} from '@arlert-dev/wallets-core/namespaces/utxo';
import { CAIP } from '@arlert-dev/wallets-core/utils';
import {
  Networks,
  type ProviderConnectResult,
} from '@arlert-dev/wallets-shared';

import { WALLET_ID } from '../constants.js';
import { bitcoinUnisat } from '../utils.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

const getBitcoinAccounts: () => Promise<ProviderConnectResult> = async () => {
  const instance = bitcoinUnisat();
  const accounts = await instance.requestAccounts();

  return {
    accounts: accounts,
    chainId: Networks.BTC,
  };
};

function getChangeAccountSubscriber(
  instance: () => ProviderAPI | undefined
): [Subscriber<UtxoActions>, SubscriberCleanUp<UtxoActions>] {
  let eventCallback: AnyFunction;

  // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
  return [
    (context, err) => {
      const bitcoinInstance = instance();

      if (!bitcoinInstance) {
        throw new Error(
          'Trying to subscribe to your Solana wallet, but seems its instance is not available.'
        );
      }

      const [, setState] = context.state();

      eventCallback = (accounts: string[]) => {
        if (!accounts.length) {
          context.action('disconnect');
          return;
        }

        const formatAccounts = accounts.map(
          (account) =>
            CAIP.AccountId.format({
              address: account,
              chainId: {
                namespace: CAIP_NAMESPACE,
                reference: CAIP_BITCOIN_CHAIN_ID,
              },
            }) as CaipAccount
        );

        setState('accounts', formatAccounts);
      };
      bitcoinInstance.on('accountsChanged', eventCallback);

      if (err instanceof Error) {
        throw err;
      }
    },
    (_context, err) => {
      const bitcoinInstance = instance();

      if (eventCallback && bitcoinInstance) {
        bitcoinInstance.removeListener('accountsChanged', eventCallback);
      }

      return err;
    },
  ];
}

const [changeAccountSubscriber, changeAccountCleanup] =
  getChangeAccountSubscriber(bitcoinUnisat);

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
        CAIP.AccountId.format({
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
