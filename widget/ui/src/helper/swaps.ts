import { PendingSwap } from '../containers/History/types';

export function groupingOfSwaps(list: PendingSwap[]) {
  return list.reduce(
    (acc: Array<{ title: string; swaps: PendingSwap[] }>, swap) => {
      const categoryIndex = acc.findIndex(
        (item) =>
          (swap.status === 'running' && item.title == 'Active Swaps') ||
          (swap.status !== 'running' && item.title == 'Recent Swaps')
      );
      if (categoryIndex > -1) {
        acc[categoryIndex].swaps.push(swap);
      } else {
        acc.push({
          title: swap.status === 'running' ? 'Active Swaps' : 'Recent Swaps',
          swaps: [swap],
        });
      }
      return acc;
    },
    []
  );
}
