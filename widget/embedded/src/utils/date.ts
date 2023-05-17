import dayjs from 'dayjs';
import { GroupBy } from '@rango-dev/ui';
import { PendingSwap } from 'rango-types';

export const groupSwapsByDate: GroupBy = (swaps) => {
  const output: Map<
    string,
    {
      title: string;
      swaps: PendingSwap[];
    }
  > = new Map([
    [
      'today',
      {
        title: 'Today',
        swaps: [],
      },
    ],
    [
      'week',
      {
        title: 'This week',
        swaps: [],
      },
    ],
    [
      'month',
      {
        title: 'This month',
        swaps: [],
      },
    ],
    [
      'year',
      {
        title: 'This year',
        swaps: [],
      },
    ],
    [
      'history',
      {
        title: 'History',
        swaps: [],
      },
    ],
  ]);

  const now = dayjs();
  swaps.forEach((swap) => {
    const swapDate = dayjs(Number(swap.creationTime));
    if (now.isSame(swapDate, 'day')) output.get('today')?.swaps.push(swap);
    else if (now.isSame(swapDate, 'week')) output.get('week')?.swaps.push(swap);
    else if (now.isSame(swapDate, 'month'))
      output.get('month')?.swaps.push(swap);
    else if (now.isSame(swapDate, 'year')) output.get('year')?.swaps.push(swap);
    else output.get('history')?.swaps.push(swap);
  });

  return Array.from(output.values());
};
