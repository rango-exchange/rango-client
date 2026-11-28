import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type {
  BlockedReason,
  ExecuterActions,
} from '@rango-dev/queue-manager-core';

import { Err, Ok, type Result } from 'ts-results';

import {
  ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION,
  ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION_WRONG_WALLET,
} from '../../constants';
import {
  getRequiredWallet,
  isRequiredWalletConnected,
  isWalletNull,
} from '../../helpers';
import { BlockReason } from '../../types';

/**
 * Makes sure the wallet the transaction needs is connected, and the connected
 * wallet's address matches the transaction's. EVM transactions run more checks
 * on top, see `checkEnvironmentBeforeExecuteEvmTransaction`.
 */
export function checkEnvironmentBeforeExecuteTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Result<true, BlockedReason> {
  return ensureRequiredWalletIsConnected(actions);
}

function ensureRequiredWalletIsConnected(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Result<true, BlockedReason> {
  const { getStorage, context } = actions;
  const { wallets } = context;
  const swap = getStorage().swapDetails;

  const isWrongAddress = !isRequiredWalletConnected(swap, context.state).ok;
  if (isWrongAddress) {
    const { type, address } = getRequiredWallet(swap);
    const isWalletInCompatible = wallets?.blockchains?.find(
      (w) => !w.accounts?.find((account) => account.walletType === type)
    );
    const description =
      isWalletNull(wallets) || isWalletInCompatible
        ? ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION(type)
        : ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION_WRONG_WALLET(type, address);

    const blockedFor = {
      reason: BlockReason.WAIT_FOR_CONNECT_WALLET,
      description,
    };
    return new Err(blockedFor);
  }

  return new Ok(true);
}
