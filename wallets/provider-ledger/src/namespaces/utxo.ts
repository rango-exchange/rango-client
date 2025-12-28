import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { UtxoActions } from '@rango-dev/wallets-core/namespaces/utxo';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  CAIP_NAMESPACE,
} from '@rango-dev/wallets-core/namespaces/utxo';
import { CAIP } from '@rango-dev/wallets-core/utils';

import { WALLET_ID } from '../constants.js';
import { setDerivationPath } from '../state.js';
import {
  getBitcoinAccounts,
  standardizeAndThrowLedgerError,
} from '../utils.js';

const connect = builders
  .connect()
  .action(async function (_context, options) {
    console.log({ options });
    if (!options?.derivationPath) {
      throw new Error('Derivation Path can not be empty.');
    }

    setDerivationPath(options.derivationPath);

    const result = await getBitcoinAccounts();

    const formatAccounts = result.accounts.map(
      (account) =>
        CAIP.AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: result.chainId,
          },
        }) as CaipAccount
    );

    return formatAccounts;
  })
  .or(standardizeAndThrowLedgerError)
  .build();

const disconnect = commonBuilders.disconnect<UtxoActions>().build();

const utxo = new NamespaceBuilder<UtxoActions>('UTXO', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { utxo };
