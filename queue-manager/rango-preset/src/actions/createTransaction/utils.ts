import type { SwapQueueContext } from '../../types';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { PendingSwap, PendingSwapStep } from 'rango-types';

import { TransactionType } from 'rango-types';

/** Maps an approve-capable chain type to its hub namespace key. */
const APPROVE_NAMESPACE_KEY_BY_CHAIN_TYPE: Partial<
  Record<TransactionType, keyof DefaultNamespaces>
> = {
  [TransactionType.EVM]: 'evm',
  [TransactionType.TRON]: 'tron',
};

/**
 * The prerequisites-based approval flow needs the wallet's hub namespace to
 * expose the `getAllowance` action (for the allowance pre-check and the post-mining
 * re-check). For EVM, injected wallets back it with their EIP-1193 provider and
 * Ledger/Trezor with a JSON-RPC instance; for Tron, bitget/tron-link back it with
 * the injected TronWeb. Wallets whose namespace does not register the action (or
 * that have no hub namespace at all) stay on the legacy server-generated approval
 * flow.
 */
export function shouldUseApprovePrerequisite(
  context: SwapQueueContext,
  swap: PendingSwap,
  currentStep: PendingSwapStep
): boolean {
  const blockchainType =
    context.meta.blockchains?.[currentStep.fromBlockchain]?.type;
  const namespaceKey = blockchainType
    ? APPROVE_NAMESPACE_KEY_BY_CHAIN_TYPE[blockchainType]
    : undefined;
  if (!namespaceKey) {
    return false;
  }

  /*
   * The source transaction is not created yet at this point, so resolve the
   * wallet directly from the swap's per-blockchain wallet map rather than from
   * the (still empty) step transaction slots.
   */
  const wallet = swap.wallets?.[currentStep.fromBlockchain];
  if (!wallet) {
    return false;
  }

  try {
    const namespace = context.hubProvider(wallet.walletType)?.get(namespaceKey);
    /*
     * `in` uses the namespace proxy's `has` trap → true only when the action
     * is actually registered on this provider (see wallets-core NamespaceBuilder).
     */
    return !!namespace && 'getAllowance' in namespace;
  } catch {
    return false;
  }
}
