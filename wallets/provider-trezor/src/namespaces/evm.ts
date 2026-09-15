import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { builders, utils } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { ETHEREUM_CHAIN_ID, WALLET_ID } from '../constants.js';
import { initTrezor } from '../init.js';
import { setDerivationPath } from '../state.js';
import {
  getEthereumAccounts,
  getTrezorNormalizedDerivationPath,
} from '../utils.js';

const connect = builders
  .connect()
  .action(async function (_context, _chain, options) {
    if (!options?.derivationPath) {
      throw new Error('Derivation Path can not be empty.');
    }
    setDerivationPath(
      getTrezorNormalizedDerivationPath(options.derivationPath)
    );

    await initTrezor();

    const result = await getEthereumAccounts();

    const formatAccounts = utils.formatAccountsToCAIP(
      result.accounts,
      result.chainId
    );

    return {
      accounts: formatAccounts,
      network: result.chainId,
    };
  })
  .or(standardizeAndThrowError)
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
