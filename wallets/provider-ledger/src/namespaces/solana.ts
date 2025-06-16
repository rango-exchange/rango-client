import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/solana';
import { CAIP } from '@rango-dev/wallets-core/utils';

import { WALLET_ID } from '../constants.js';
import { setDerivationPath } from '../state.js';
import { getSolanaAccounts, standardizeAndThrowLedgerError } from '../utils.js';

const connect = builders
  .connect()
  .action(async function (_context, _chain, derivationPath) {
    if (!derivationPath) {
      throw new Error('Derivation Path can not be empty.');
    }

    setDerivationPath(derivationPath);

    const result = await getSolanaAccounts();

    const formatAccounts = result.accounts.map(
      (account) =>
        CAIP.AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: CAIP_SOLANA_CHAIN_ID,
          },
        }) as CaipAccount
    );

    return formatAccounts;
  })
  .or(standardizeAndThrowLedgerError)
  .build();

const disconnect = commonBuilders.disconnect<SolanaActions>().build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { solana };
