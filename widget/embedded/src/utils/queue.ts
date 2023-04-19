import { Manager } from '@rango-dev/queue-manager-core';
import {
  PendingSwapWithQueueID,
  SwapProgressNotification,
  SwapStorage,
} from '@rango-dev/queue-manager-rango-preset';
import { useMetaStore } from '../store/meta';

export const getPendingSwaps = (manager: Manager | undefined) => {
  const result: PendingSwapWithQueueID[] = [];

  manager?.getAll().forEach((q, id) => {
    const storage = q.list.getStorage() as SwapStorage;

    if (storage?.swapDetails) {
      result.push({
        id,
        swap: storage?.swapDetails,
      });
    }
  });

  return result.sort(
    (a, b) => Number(b.swap.creationTime) - Number(a.swap.creationTime)
  );
};

export function getMessage({
  swap,
  eventType: type,
  step,
}: SwapProgressNotification): string | null {
  const swappers = useMetaStore.getState().meta.swappers;
  const swapperName = swappers?.find((s) => s.id === step?.swapperId)?.title;
  console.log(type);

  const fromAsset = `${step?.fromBlockchain}.${step?.fromSymbol}`;
  const toAsset = `${step?.toBlockchain}.${step?.toSymbol}`;
  const outputAmount = step?.outputAmount || '';
  const currentFromBlockchain = step?.fromBlockchain;

  if (type === 'swap_started') return 'Swap process started';
  if (type === 'confirm_contract')
    return `Please confirm '${swapperName}' smart contract access to ${fromAsset}`;
  if (type === 'confirm_transfer')
    return `Please confirm transfer request in your wallet`;
  if (type === 'task_failed')
    return `Swap failed: ${swap?.extraMessage || 'Reason is unknown'}`;
  if (type === 'task_paused') return `Swap paused successfully!`;
  if (type === 'task_canceled') return `Swap canceled!`;
  if (type === 'task_completed')
    return `You received ${outputAmount} ${toAsset}, hooray!`;
  if (type === 'contract_confirmed')
    return `Smart contract approved successfully`;
  if (type === 'contract_rejected')
    return `You rejected smart contract access, swap cancelled!`;
  if (type === 'transfer_rejected') return `Transfer request got rejected!`;
  if (type === 'calling_smart_contract')
    return `Sending request to ${swapperName} for ${fromAsset} token`;
  if (type === 'smart_contract_called')
    return `Request sent to ${swapperName} for ${fromAsset} token`;
  if (type === 'smart_contract_call_failed')
    return `Failed to call smart contract ${swapperName} for ${fromAsset} token`;
  if (type === 'step_completed_with_output') return null;
  if (type === 'waiting_for_network_change')
    return `Please change your wallet network to ${currentFromBlockchain}.`;
  if (type === 'waiting_for_connecting_wallet')
    return `Please connect your wallet.`;
  if (type === 'network_changed')
    return `Network changed to ${currentFromBlockchain} successfully!`;
  if (type === 'not_enough_balance')
    return `Not enough balance to execute this swap!`;
  if (type === 'check_fee_failed')
    return `Failed to check fee from server, please retry later!`;
  return null;
}

export function getType(status: string): 'success' | 'error' | undefined {
  switch (status) {
    case 'success':
      return 'success';
    case 'failed':
      return 'error';
    default:
      return undefined;
  }
}
