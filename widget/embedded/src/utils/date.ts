import type { GroupBy } from '../components/HistoryGroupedList/HistoryGroupedList.types';
import type { PendingSwap } from 'rango-types';

import { i18n } from '@lingui/core';
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
        title: i18n.t('Today'),
        swaps: [],
      },
    ],
    [
      'week',
      {
        title: i18n.t('This week'),
        swaps: [],
      },
    ],
    [
      'month',
      {
        title: i18n.t('This month'),
        swaps: [],
      },
    ],
    [
      'year',
      {
        title: i18n.t('This year'),
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

  const groupedSwaps = Array.from(output.values()).filter(
    (item) => item.swaps.length > 0
  );
  const items = groupedSwaps.flatMap((group) => group.swaps);
  const groupCounts = groupedSwaps.map((group) => group.swaps.length);
  const groups = groupedSwaps.map((group) => group.title);

  return { swaps: items, groupCounts, groups };
};
