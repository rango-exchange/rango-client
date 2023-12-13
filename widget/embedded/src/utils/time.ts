import type { PendingSwap } from 'rango-types';

import { i18n } from '@lingui/core';

const MILLISECOND_PER_SECOND = 1000;
const SECONDS_PER_YEAR = 31536000;
const SECONDS_PER_MONTH = 2592000;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

export function timeSince(millisecond: number): string {
  const seconds = Math.floor(
    (Date.now() - millisecond) / MILLISECOND_PER_SECOND
  );

  const intervals = [
    {
      turningPoint: SECONDS_PER_YEAR,
      label: i18n.t('year'),
      pluralLabel: i18n.t('years'),
    },
    {
      turningPoint: SECONDS_PER_MONTH,
      label: i18n.t('month'),
      pluralLabel: i18n.t('months'),
    },
    {
      turningPoint: SECONDS_PER_DAY,
      label: i18n.t('day'),
      pluralLabel: i18n.t('days'),
    },
    {
      turningPoint: SECONDS_PER_HOUR,
      label: i18n.t('hour'),
      pluralLabel: i18n.t('hours'),
    },
    {
      turningPoint: SECONDS_PER_MINUTE,
      label: i18n.t('minute'),
      pluralLabel: i18n.t('minutes'),
    },
  ];

  const sortedIntervals = intervals.sort(
    (a, b) => b.turningPoint - a.turningPoint
  );

  for (const interval of sortedIntervals) {
    const { turningPoint, label, pluralLabel } = interval;
    const intervalCount = Math.floor(seconds / turningPoint);
    if (intervalCount > 1) {
      return `${intervalCount} ${pluralLabel}`;
    }
    if (intervalCount === 1) {
      return `${intervalCount} ${label}`;
    }
  }

  if (seconds > 1) {
    return `${seconds} ${i18n.t('seconds')}`;
  }

  return `${seconds} ${i18n.t('second')}`;
}

export function getSwapDate(pendingSwap: PendingSwap) {
  return pendingSwap.finishTime
    ? i18n.t({
        id: '{time} ago',
        values: { time: timeSince(parseInt(pendingSwap.finishTime)) },
      })
    : i18n.t({
        id: '{time} ago',
        values: { time: timeSince(parseInt(pendingSwap.creationTime)) },
      });
}
