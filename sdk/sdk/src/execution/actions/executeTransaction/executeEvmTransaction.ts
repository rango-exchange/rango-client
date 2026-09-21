import type { ExecuteHooks } from './types';
import type { ActionContext } from '../../context';
import type { SwapExecution } from '../../types';
import type { EvmTransaction } from 'rango-sdk';

import { TransactionType } from 'rango-types';

import { ensureEvmEnvironment } from '../environment/mod';
import { getSigner, signAndSendTx } from '../signer';

/**
 * Signs an EVM transaction once the wallet is connected with the swap's
 * account and on the transaction's chain, switching it there when it can.
 * The chain id from meta goes to the signer as well, so the signer's own
 * check catches a wallet that moved in between.
 */
export async function executeEvmTransaction(
  exec: SwapExecution,
  context: ActionContext,
  tx: EvmTransaction,
  hooks: ExecuteHooks = {}
): Promise<{ hash: string }> {
  const { wallet, provider, chainId } = await ensureEvmEnvironment(
    exec,
    context,
    tx.blockChain
  );
  const signer = await getSigner<EvmTransaction>(provider, TransactionType.EVM);

  await hooks.beforeSign?.();
  return signAndSendTx(signer, tx, wallet.address, chainId);
}
