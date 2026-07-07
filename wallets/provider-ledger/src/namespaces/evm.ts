import type { EvmActions } from '@hub3js/evm';
import type { CaipAccount } from '@hub3js/std/types';

import { NamespaceBuilder } from '@hub3js/core';
import { builders, CAIP_NAMESPACE } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { ETHEREUM_CHAIN_ID } from '@rango-dev/wallets-shared';
import { AccountId } from 'caip';

import { WALLET_ID } from '../constants.js';
import { setDerivationPath } from '../state.js';
import {
  getEthereumAccounts,
  standardizeAndThrowLedgerError,
} from '../utils.js';

const connect = builders
  .connect()
  .action(async function (_context, _chain, options) {
    if (!options?.derivationPath) {
      throw new Error('Derivation Path can not be empty.');
    }

    setDerivationPath(options.derivationPath);

    const result = await getEthereumAccounts();

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

    return {
      accounts: formatAccounts,
      network: result.chainId,
    };
  })
  .or(standardizeAndThrowLedgerError)
  .build();

const disconnect = commonBuilders.disconnect<EvmActions>().build();

const getChainId = builders
  .getChainId()
  .action(() => ETHEREUM_CHAIN_ID)
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(getChainId)
  .build();

export { evm };
