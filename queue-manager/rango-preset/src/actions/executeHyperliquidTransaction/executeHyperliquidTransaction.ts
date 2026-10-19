import type { SwapQueueContext, SwapStorage } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';

import { Err } from 'ts-results';

import {
  getCurrentStep,
  getCurrentStepTx,
  handleRejectedSign,
} from '../../helpers';
import { getCurrentAddressOf, getRelatedWallet } from '../../shared';
import { SwapActionTypes } from '../../types';
import { checkEnvironmentBeforeExecuteTransaction } from '../common/checkEnvironmentBeforeExecuteTransaction';
import { signEvmTypedData } from '../common/evm';
import {
  onNextStateError,
  onNextStateOk,
  produceNextStateForTransaction,
} from '../common/produceNextStateForTransaction';
import { requestBlockQueue } from '../common/utils';

import {
  ensureHyperliquidTransactionIsValid,
  getTypedDataFromMessage,
  initiateWithdrawalRequest,
  splitSignature,
} from './utils';

export async function executeHyperliquidTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const checkResult = await checkEnvironmentBeforeExecuteTransaction(actions);
  if (checkResult.err) {
    requestBlockQueue(actions, checkResult.val);
    return;
  }

  const { failed, getStorage, context, schedule, next } = actions;

  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;

  const onFinish = () => {
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const onSuccessfulFinish = () => {
    schedule(SwapActionTypes.CHECK_HYPERLIQUID_TRANSACTION_STATUS);
    next();
    onFinish();
  };

  const handleErr = (err: Err<NextTransactionStateError>) => {
    onNextStateError(actions, err.val);
    failed();
    onFinish();
  };

  /*
   * Checking the current transaction state to determine the next step.
   * It will either be Err, indicating process should stop, or Ok, indicating process should continu.
   */
  const nextStateResult = produceNextStateForTransaction(actions);

  if (nextStateResult.err) {
    handleErr(nextStateResult);
    return;
  }

  // On sucess, we should update Swap object and also call notifier
  onNextStateOk(actions, nextStateResult.val);

  // when we are producing next step, it will check to tx shouldn't be null. So ! here is safe.
  const currentTransactionFromStorage = getCurrentStepTx(currentStep)!;
  const hyperliquidTransactionResult = ensureHyperliquidTransactionIsValid(
    currentTransactionFromStorage
  );
  if (hyperliquidTransactionResult.err) {
    handleErr(hyperliquidTransactionResult);
    return;
  }
  const hyperliquidTransaction = hyperliquidTransactionResult.val;

  const sourceWallet = getRelatedWallet(swap, currentStep);
  const walletAddress = getCurrentAddressOf(swap, currentStep);

  // Hyperliquid transactions are EIP-712 messages signed by the EVM wallet.
  const namespace = context.hubProvider(sourceWallet.walletType).get('evm');
  if (!namespace) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message:
          'Unexpected Error: The EVM namespace is not available on your wallet.',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  if (!('signTypedData' in namespace)) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message:
          'Unexpected Error: Your wallet does not support signTypedData.',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  const typedData = getTypedDataFromMessage(hyperliquidTransaction.message);
  if (typedData.err) {
    handleErr(typedData);
    return;
  }

  let signature: `0x${string}`;
  try {
    signature = await signEvmTypedData(namespace, typedData.val, walletAddress);
  } catch (error) {
    handleRejectedSign(actions)(error);
    onFinish();
    return;
  }

  const splitSignatureResult = splitSignature(signature);
  if (splitSignatureResult.err) {
    handleErr(splitSignatureResult);
    return;
  }
  const splittedSignature = splitSignatureResult.val;

  const initiateWithdrawalResponse = await initiateWithdrawalRequest(
    hyperliquidTransaction.action,
    splittedSignature,
    hyperliquidTransaction.nonce
  );
  if (initiateWithdrawalResponse.err) {
    handleErr(initiateWithdrawalResponse);
    return;
  }

  if (initiateWithdrawalResponse.val.status !== 'ok') {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: 'Unexpected Error: Failed to initiate withdrawal.',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  onSuccessfulFinish();
}
