import type {
  ApproveAdapter,
  ApproveNamespace,
  ApproveNamespaceKey,
  ApprovePrerequisite,
  ApprovePrerequisiteResult,
} from './types';
import type { ActionContext } from '../../../context';
import type { SwapExecution } from '../../../types';
import type { Transaction } from 'rango-sdk';
import type { TransactionPrerequisiteResult } from 'rango-types';

import { ActionError } from '../../../../errors';
import { getSigner, signAndSendTx } from '../../signer';
import { getWalletProvider } from '../../wallets';

import {
  confirmAllowanceOnChain,
  isAllowanceSufficient,
  resolveApproveNamespace,
} from './allowance';

export type ApprovePrerequisiteParams = {
  prerequisite: ApprovePrerequisite;
  prerequisiteIndex: number;
  current: TransactionPrerequisiteResult | undefined;
};

/**
 * Runs an approve prerequisite one step further; the adapter holds what
 * differs per chain.
 *
 * With no result yet, it first makes sure the wallet is ready to be asked
 * (connected, right account, and for EVM on the right chain), since the
 * allowance is read through the wallet too. Then it reads the allowance:
 * enough already means nothing to do (`skipped`); otherwise it signs an
 * approve and records the hash as `pending`. With a `pending` result, it
 * looks the transaction up: not included yet returns `null` so the loop asks
 * again; a reverted approve gives `failed`; a mined one is only `success`
 * once the allowance itself reads as sufficient, and fails the swap with
 * `INSUFFICIENT_APPROVE` when it never does.
 */
export async function executeApprovePrerequisite<
  K extends ApproveNamespaceKey,
  Tx extends Transaction
>(
  exec: SwapExecution,
  params: ApprovePrerequisiteParams,
  context: ActionContext,
  adapter: ApproveAdapter<K, Tx>
): Promise<ApprovePrerequisiteResult | null> {
  const { prerequisite, prerequisiteIndex, current } = params;
  const key = { prerequisiteIndex, prerequisiteType: adapter.prerequisiteType };

  const { wallet, provider } = getWalletProvider(
    exec,
    prerequisite.blockChain,
    context.getProvider
  );
  const namespace = resolveApproveNamespace(provider, adapter.namespaceKey);

  if (current) {
    if (
      current.prerequisiteType !== adapter.prerequisiteType ||
      current.status !== 'pending'
    ) {
      throw new ActionError(
        'CLIENT_UNEXPECTED_BEHAVIOUR',
        `Approve prerequisite ${prerequisiteIndex} cannot continue from status ${current.status}`
      );
    }
    return checkApproveTransaction(
      { ...key, hash: current.data.executedTransactionHash },
      prerequisite,
      namespace,
      adapter
    );
  }

  const { chainId } = await adapter.ensureEnvironment(
    exec,
    context,
    prerequisite.blockChain
  );

  if (await isAllowanceSufficient(prerequisite, namespace)) {
    return { ...key, status: 'skipped', data: null };
  }

  const tx = await adapter.buildApproveTransaction(prerequisite, namespace);
  const signer = await getSigner<Tx>(provider, adapter.signerTxType);
  const { hash } = await signAndSendTx(signer, tx, wallet.address, chainId);

  return {
    ...key,
    status: 'pending',
    data: { executedTransactionHash: hash },
  };
}

async function checkApproveTransaction<
  K extends ApproveNamespaceKey,
  Tx extends Transaction
>(
  key: {
    prerequisiteIndex: number;
    prerequisiteType: ApprovePrerequisite['type'];
    hash: string;
  },
  prerequisite: ApprovePrerequisite,
  namespace: ApproveNamespace<K>,
  adapter: ApproveAdapter<K, Tx>
): Promise<ApprovePrerequisiteResult | null> {
  const { hash, ...base } = key;
  const status = await adapter.getTransactionStatus(namespace, hash);

  if (status === 'pending') {
    return null;
  }
  if (status === 'failed') {
    return {
      ...base,
      status: 'failed',
      data: { executedTransactionHash: hash },
    };
  }

  if (!(await confirmAllowanceOnChain(prerequisite, namespace))) {
    throw new ActionError(
      'INSUFFICIENT_APPROVE',
      `The allowance for ${prerequisite.token} is still below ${prerequisite.amount} after the approve transaction`
    );
  }

  return {
    ...base,
    status: 'success',
    data: { executedTransactionHash: hash },
  };
}
