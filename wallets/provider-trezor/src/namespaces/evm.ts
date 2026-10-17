import type { Context } from '@hub3js/core';
import type {
  AllowanceParams,
  EvmActions,
  EvmTransactionReceipt,
} from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { builders, utils } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import { Contract, toBeHex } from 'ethers';

import { ETHEREUM_CHAIN_ID, WALLET_ID } from '../constants.js';
import { initTrezor } from '../init.js';
import { setDerivationPath } from '../state.js';
import {
  getEthereumAccounts,
  getEvmRpcProvider,
  getTrezorNormalizedDerivationPath,
} from '../utils.js';

const ERC20_ALLOWANCE_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
];

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

/*
 * Trezor injects no EIP-1193 provider, so these read actions talk to the shared
 * JSON-RPC provider directly rather than through the default hub3js/evm actions.
 */
const getAllowance = builders
  .getAllowance()
  .action(
    async (
      _context: Context<EvmActions>,
      params: AllowanceParams
    ): Promise<string> => {
      const token = new Contract(
        params.token,
        ERC20_ALLOWANCE_ABI,
        getEvmRpcProvider()
      );
      const currentAllowance: bigint = await token.allowance(
        params.owner,
        params.spender
      );
      return currentAllowance.toString();
    }
  )
  .build();

const getTransactionReceipt = builders
  .getTransactionReceipt()
  .action(
    async (
      _context: Context<EvmActions>,
      transactionHash: `0x${string}`
    ): Promise<EvmTransactionReceipt | null> => {
      const receipt = await getEvmRpcProvider().getTransactionReceipt(
        transactionHash
      );
      if (!receipt) {
        return null;
      }
      return {
        status: receipt.status === 1 ? '0x1' : '0x0',
        transactionHash: receipt.hash,
        blockNumber: toBeHex(receipt.blockNumber),
      };
    }
  )
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(getChainId)
  .action(getAllowance)
  .action(getTransactionReceipt)
  .build();

export { evm };
