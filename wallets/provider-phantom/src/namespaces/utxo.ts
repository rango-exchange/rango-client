import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  CAIP_NAMESPACE,
} from '@rango-dev/wallets-core/namespaces/utxo';
import { CAIP } from '@rango-dev/wallets-core/utils';
import { Networks } from '@rango-dev/wallets-shared';

import { WALLET_ID } from '../constants.js';
import { bitcoinPhantom, getBitcoinAccounts } from '../utils.js';

const connect = builders
  .connect()
  .action(async function () {
    const bitcoinInstance = bitcoinPhantom();
    const result = await getBitcoinAccounts({
      instance: bitcoinInstance,
      meta: [],
    });
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
            reference: Networks.BTC,
          },
        }) as CaipAccount
    );

    return [formatAccounts[0]];
  })
  .build();

const disconnect = commonBuilders.disconnect<UtxoActions>().build();

const utxo = new NamespaceBuilder<UtxoActions>('Utxo', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { utxo };
