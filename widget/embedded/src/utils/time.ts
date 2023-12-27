import type { PendingSwap } from 'rango-types';

import { i18n } from '@lingui/core';

const daysOfWeek = [
  i18n.t('Sunday'),
  i18n.t('Monday'),
  i18n.t('Tuesday'),
  i18n.t('Wednesday'),
  i18n.t('Thursday'),
  i18n.t('Friday'),
  i18n.t('Saturday'),
];

export function timeSince(millisecond: number) {
  const date = new Date(millisecond);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const isToday = date.getDay() === new Date().getDay();
  const formattedDate = isToday
    ? i18n.t('Today')
    : `${daysOfWeek[date.getDay()]} ${day} ${month} ${year}`;

  return `${formattedDate}, ${new Date(millisecond).toLocaleTimeString()}`;
}

export function getSwapDate(pendingSwap: PendingSwap) {
  const time = pendingSwap.finishTime
    ? timeSince(parseInt(pendingSwap.finishTime))
    : timeSince(parseInt(pendingSwap.creationTime));
  return time;
}
