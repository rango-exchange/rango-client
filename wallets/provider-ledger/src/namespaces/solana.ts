import type { Context } from '@hub3js/core';
import type { SolanaActions } from '@hub3js/solana';
import type { CaipAccount } from '@hub3js/std/types';

import { Hub3Error, NamespaceBuilder } from '@hub3js/core';
import { builders, CAIP_NAMESPACE, solanaKitAdapter } from '@hub3js/solana';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import { AccountId } from 'caip';

import { WALLET_ID } from '../constants.js';
import { signMessage, signTransaction } from '../signers/solana.js';
import { setDerivationPath } from '../state.js';
import { getSolanaAccounts } from '../utils.js';

type ConnectOptions = Parameters<SolanaActions['connect']>[0];

/*
 * The builder takes any Solana action, too many kinds to infer the parameters
 * from, so they're typed here.
 */
const connect = builders
  .connect()
  .action(async function (
    _context: Context<SolanaActions>,
    options?: ConnectOptions
  ) {
    if (!options?.derivationPath) {
      throw new Hub3Error(
        'PROVIDER_UNEXPECTED',
        'Derivation Path can not be empty.'
      );
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
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders.disconnect<SolanaActions>().build();

// Signs on the device, and reads through the Solana RPC URL when one is given.
const buildSolana = (rpcURLs?: string[]) => {
  const builder = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
    .action(connect)
    .action(disconnect)
    // Signed on the device, see `signers/solana.ts`.
    .action('signTransaction', signTransaction)
    .action('signMessage', signMessage);

  const [rpcURL] = rpcURLs ?? [];
  if (rpcURL) {
    builder.action(solanaKitAdapter(rpcURL));
  }

  return builder.build();
};

export { buildSolana };
