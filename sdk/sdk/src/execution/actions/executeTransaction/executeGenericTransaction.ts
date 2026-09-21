import type { ExecuteHooks } from './types';
import type { ActionContext } from '../../context';
import type { SwapExecution } from '../../types';
import type { Transaction } from 'rango-sdk';

import { ActionError } from '../../../errors';
import { ensureWalletConnected, SIGNING_NAMESPACES } from '../environment/mod';
import { getSigner, signAndSendTx } from '../signer';

/**
 * Signs a transaction of a type with nothing chain-specific to check: the
 * wallet has to be connected with the swap's account on the namespace that
 * signs for the type, and that is all. The chain id from meta goes to the
 * signer, as it does for every type.
 */
export async function executeGenericTransaction(
  exec: SwapExecution,
  context: ActionContext,
  tx: Transaction,
  hooks: ExecuteHooks = {}
): Promise<{ hash: string }> {
  const namespaceKey = SIGNING_NAMESPACES[tx.type];
  if (!namespaceKey) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `${tx.type} transactions are not supported`
    );
  }

  const { wallet, provider, chainId } = ensureWalletConnected(exec, context, {
    blockChain: tx.blockChain,
    namespaceKey,
  });
  const signer = await getSigner<Transaction>(provider, tx.type);

  await hooks.beforeSign?.();
  return signAndSendTx(signer, tx, wallet.address, chainId);
}
