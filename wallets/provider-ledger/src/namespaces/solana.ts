import type { SolanaActions } from '@hub3js/solana';
import type { CaipAccount } from '@hub3js/std/types';

import { NamespaceBuilder } from '@hub3js/core';
import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import { builders, CAIP_NAMESPACE } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { throwWalletConnectionError } from '@hub3js/std/operators';
import { AccountId } from 'caip';

import { WALLET_ID } from '../constants.js';
import { commonHooks } from '../hooks/common.js';
import { setDerivationPath } from '../state.js';
import { getSolanaAccounts } from '../utils.js';

const connect = builders
  .connect()
  .action(async function (_context, options) {
    if (!options?.derivationPath) {
      throw new Error('Derivation Path can not be empty.');
    }

    setDerivationPath(options.derivationPath);

    const result = await getSolanaAccounts();

    const formatAccounts = result.accounts.map(
      (account) =>
        AccountId.format({
          address: account,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: result.chainId,
          },
        }) as CaipAccount
    );

    return formatAccounts;
  })
  .or(commonHooks.convertLedgerRejectionError)
  .or(commonHooks.convertLedgerDeviceError)
  .or(throwWalletConnectionError(SOLANA_NAMESPACE))
  .build();

const disconnect = commonBuilders.disconnect<SolanaActions>().build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { solana };
