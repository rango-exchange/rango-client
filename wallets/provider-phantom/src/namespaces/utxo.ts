import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type {
  ProviderAPI,
  UtxoActions,
} from '@rango-dev/wallets-core/namespaces/utxo';

import {
  NamespaceBuilder,
  type Subscriber,
  type SubscriberCleanUp,
} from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  CAIP_BITCOIN_CHAIN_ID,
  CAIP_NAMESPACE,
} from '@rango-dev/wallets-core/namespaces/utxo';
import { CAIP } from '@rango-dev/wallets-core/utils';
import {
  Networks,
  type ProviderConnectResult,
} from '@rango-dev/wallets-shared';

import { WALLET_ID } from '../constants.js';
import { bitcoinPhantom } from '../utils.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

type BtcAccount = {
  address: string;
  publicKey: string;
  addressType: 'p2tr' | 'p2wpkh' | 'p2sh' | 'p2pkh';
  purpose: 'payment' | 'ordinals';
};

const getBitcoinAccounts: () => Promise<ProviderConnectResult> = async () => {
  const instance = bitcoinPhantom();
  const accounts = await instance.requestAccounts();

  return {
    accounts: accounts
      .filter((account: BtcAccount) => account.purpose === 'payment')
      .map((account: BtcAccount) => account.address),
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

      eventCallback = (accounts: BtcAccount[]) => {
        /*
         * In Phantom, when user is switching to an account which is not connected to dApp yet, it returns an empty array on `accountsChanged`.
         * So empty array means we don't have access to account and we need to disconnect and let the user connect the account.
         */
        if (!accounts.length) {
          context.action('disconnect');
          return;
        }

        const formatAccounts = accounts
          .filter((account) => account.purpose === 'payment')
          .map(
            (account: BtcAccount) =>
              CAIP.AccountId.format({
                address: account.address,
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
        bitcoinInstance.off('accountsChanged', eventCallback);
      }

      if (err instanceof Error) {
        throw err;
      }
    },
  ];
}

const [changeAccountSubscriber, changeAccountCleanup] =
  getChangeAccountSubscriber(bitcoinPhantom);

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
