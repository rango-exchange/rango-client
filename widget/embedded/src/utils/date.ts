import type { GroupBy } from '../components/SwapsGroup/SwapsGroup.types';
import type { PendingSwap } from 'rango-types';

import dayjs from 'dayjs';

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
  ]);

  function addYearsToOutput(key: string, swap: PendingSwap) {
    if (!output.has(key)) {
      output.set(key, {
        title: key,
        swaps: [],
      });
    }
    output.get(key)?.swaps.push(swap);
  }

  const now = dayjs();
  swaps.forEach((swap) => {
    const time = Number(swap.creationTime);
    const swapDate = dayjs(time);
    if (now.isSame(swapDate, 'day')) {
      output.get('today')?.swaps.push(swap);
    } else if (now.isSame(swapDate, 'week')) {
      output.get('week')?.swaps.push(swap);
    } else if (now.isSame(swapDate, 'month')) {
      output.get('month')?.swaps.push(swap);
    } else if (now.isSame(swapDate, 'year')) {
      output.get('year')?.swaps.push(swap);
    } else {
      const year = new Date(time).getFullYear().toString();
      addYearsToOutput(year, swap);
    }
  });

  return Array.from(output.values());
};
