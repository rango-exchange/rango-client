import type { Context } from '@hub3js/core';
import type { AllowanceParams, EvmActions } from '@hub3js/evm';
import type { CaipAccount } from '@hub3js/std/types';

import { NamespaceBuilder } from '@hub3js/core';
import {
  builders,
  CAIP_NAMESPACE,
  viemPublicActions,
  viemPublicAdapter,
} from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { AccountId } from 'caip';

import { ETHEREUM_CHAIN_ID, WALLET_ID } from '../constants.js';
import { sendTransaction, signMessage } from '../signers/ethereum.js';
import { setDerivationPath } from '../state.js';
import {
  getEthereumAccounts,
  standardizeAndThrowLedgerError,
} from '../utils.js';

const ERC20_ALLOWANCE_ABI = [
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

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

/*
 * Ledger injects no EIP-1193 provider, so the allowance is read with the public
 * client's `readContract`, which `buildEvm` registers.
 */
const getAllowance = builders
  .getAllowance()
  .action(
    async (
      context: Context<EvmActions>,
      params: AllowanceParams
    ): Promise<string> => {
      const allowance = (await context.action('readContract', {
        address: params.token,
        abi: ERC20_ALLOWANCE_ABI,
        functionName: 'allowance',
        args: [params.owner, params.spender],
      })) as bigint;
      return allowance.toString();
    }
  )
  .build();

const buildEvm = (rpcUrl: string) =>
  new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
    .action(connect)
    .action(disconnect)
    .action(getChainId)
    .action(getAllowance)
    // Every public action except the receipt ones, which are picked below.
    .action(viemPublicAdapter(rpcUrl))
    .action(
      viemPublicActions(rpcUrl, [
        'getTransactionReceipt',
        'waitForTransactionReceipt',
      ])
    )
    // Signed on the device, see `signers/ethereum.ts`.
    .action('sendTransaction', sendTransaction)
    .action('signMessage', signMessage)
    .build();

export { buildEvm };
