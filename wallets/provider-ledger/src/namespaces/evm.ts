import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  type CaipAccount,
  builders as commonBuilders,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  CAIP_NAMESPACE,
} from '@rango-dev/wallets-core/namespaces/evm';
import { CAIP } from '@rango-dev/wallets-core/utils';
import { ETHEREUM_CHAIN_ID } from '@rango-dev/wallets-shared';

import { WALLET_ID } from '../constants.js';
import { setDerivationPath } from '../state.js';
import {
  getEthereumAccounts,
  standardizeAndThrowLedgerError,
} from '../utils.js';

const connect = builders
  .connect()
  .action(async function (_context, chain, derivationPath) {
    if (!derivationPath) {
      throw new Error('Derivation Path can not be empty.');
    }

    setDerivationPath(derivationPath);

    const result = await getEthereumAccounts();

    const formatAccounts = result.accounts.map(
      (account) =>
        CAIP.AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: ETHEREUM_CHAIN_ID,
          },
        }) as CaipAccount
    );

    return {
      accounts: formatAccounts,
      network: ETHEREUM_CHAIN_ID,
    };
  })
  .or(standardizeAndThrowLedgerError)
  .build();

const disconnect = commonBuilders.disconnect<EvmActions>().build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { evm };
